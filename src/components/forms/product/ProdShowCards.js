import React, {useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Pagination, Select, Radio } from "antd";
import { toast } from "react-toastify";
import Joi from "joi-browser";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { read, utils, writeFile } from 'xlsx';
import { isMobile } from 'react-device-detect';

import AdminProdCard from "../../cards/AdminProdCard";

import { createProduct, removeProduct } from "../../../functions/product";
import { updateChanges } from "../../../functions/estore";
import { removeFileImage, checkImageUser } from '../../../functions/admin';
import { getAllProduct, updateProducts } from '../../../functions/export';

const { confirm } = Modal;
const { Option } = Select;

const ProdShowCards = ({ values, setValues, loading, setLoading }) => {
    let dispatch = useDispatch();
    const { products, itemsCount, pageSize, currentPage } = values;

    const [allProducts, setAllProducts] = useState([]);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [exportType, setExportType] = useState("all");
    const [importing, setImporting] = useState(false);
    const [finalProducts, setFinalProducts] = useState([]);

    const { user, admin, estore } = useSelector((state) => ({ ...state }));

    const schema = {
        title: Joi.string().max(128).required(),
        description: Joi.string().max(2000),
        supplierPrice: Joi.number(),
        markup: Joi.number(),
        markuptype: Joi.string(),
        price: Joi.number().required(),
        referral: Joi.number(),
        referraltype: Joi.string(),
        category: Joi.string().required(),
        subcats: Joi.array(),
        parent: Joi.string().required(),
        quantity: Joi.number(),
        variants: Joi.array(),
        images: Joi.array(),
    };

    const handleDuplicate = (product) => {
        if (product) {
            const copyProduct = {
                ...product,
                title: product.title + " - copy",
                category: product.category._id ? product.category._id : product.category,
                subcats: product.subcats && product.subcats.map(subcat => subcat._id ? subcat._id : subcat),
                parent: product.parent._id ? product.parent._id : product.parent,
                variants: product.variants && product.variants.map(variant => { return { name: variant.name, quantity: variant.quantity } })
            };
            handleCopying(copyProduct);
        } else {
            toast.error("Product cannot be copied");
        }
    }

    const handleCopying = async (product) => {
        delete product._id;
        delete product.__v;
        delete product.createdAt;
        delete product.updatedAt;
        delete product.page;
        delete product.noAvail;
        delete product.ratings;
        delete product.sold;
        delete product.activate;
        delete product.slug;

        const validate = Joi.validate(product,
            schema,
            {
                abortEarly: false,
            }
        );

        if (validate.error) {
            for (let item of validate.error.details) toast.error(item.message);
            return;
        }

        setLoading(true);

        createProduct( product, user.token ).then((res) => {
            toast.success(`${res.data.ops[0].title} is copied`);
            setLoading(false);

            if (admin.products.values.length > 0) {
                admin.products.values.unshift({ ...res.data.ops[0], page: 1 });

                const newProdCount = parseInt(admin.products.itemsCount) + 1;
                
                setValues({
                    ...values,
                    products: admin.products.values,
                    itemsCount: newProdCount
                });

                dispatch({
                    type: "ADMIN_OBJECT_XVIII",
                    payload: {
                        products: {
                            ...admin.products,
                            itemsCount: newProdCount
                        }
                    },
                });

                updateChanges( estore._id, "productChange", user.token ).then((res) => {
                    dispatch({
                        type: "ESTORE_INFO_XIX",
                        payload: res.data,
                    });
                });
            }
        })
        .catch((error) => {
            if (error.response.status === 400 || 404)
                toast.error(error.response.data);
            else
                toast.error(error.message);
            setLoading(false);
        });
    };
    
    const handleRemove = (slug, title, images) => {
        confirm({
            title: "Are you sure you want to delete " + title + "?",
            icon: <ExclamationCircleOutlined />,
            content: "Deleting this product will also delete all its images.",
            okText: "Yes",
            okType: "danger",
            cancelText: "No",
            onOk() {
                removeProduct(slug, user.token)
                    .then(async (res) => {
                        for (let i = 0; i < images.length; i++) {
                            await checkImageUser(images[i].public_id, user.token).then(async (res) => {
                                if (!res.data)
                                    await removeFileImage(images[i].public_id, estore, user.token);
                            })
                        }

                        toast.error(`${res.data.title} is deleted`);

                        const newAdminProducts = admin.products.values.filter(
                            (product) => product.slug !== slug
                        );

                        const newProdCount = parseInt(admin.products.itemsCount) - 1;

                        setValues({
                            ...values,
                            products: newAdminProducts,
                            itemsCount: newProdCount
                        });

                        dispatch({
                            type: "ADMIN_OBJECT_IX",
                            payload: {
                                products: {
                                    ...admin.products,
                                    values: newAdminProducts,
                                    itemsCount: newProdCount
                                }
                            },
                        });

                        updateChanges(
                            estore._id,
                            "productChange",
                            user.token
                        ).then((res) => {
                            dispatch({
                                type: "ESTORE_INFO_IX",
                                payload: res.data,
                            });
                        });
                    })
                    .catch((error) => {
                        if (error.response.status === 400 || 404)
                            toast.error(error.response.data);
                        else toast.error(error.message);
                    });
            },
            onCancel() { },
        });
    };

    const showGoToPage = () => {
        const totalPage = parseInt(itemsCount / pageSize) + 1;
        let optResult = [];
        for ( let i = 1; i <= totalPage; i++){
            optResult.push(<Option key={i} value={i}>{i}</Option>)
        }
        return optResult.map(opt => opt);
    }

    const showExport = () => {
        setImporting(true);
        setIsExportOpen(true);
        getAllProduct(user.token).then(res => {
            setAllProducts(res.data);
            setImporting(false);
        })
    };

    const handleExportOk = () => {
        let productExp = [];
        setIsExportOpen(false);

        if (exportType === "all") {
            productExp = allProducts.map(prod => {
                return {
                    _id: prod._id,
                    title: prod.title,
                    price: prod.supplierPrice,
                    markup: prod.markup,
                    markuptype: prod.markuptype,
                    referral: prod.referral,
                    referraltype: prod.referraltype
                }
            });
        }
        
        const headings = [[
            'ID',
            'Product',
            'Supplier_Price',
            'Markup',
            'Markup_Type',
            'Referral',
            'Referral_Type'
        ]];
        const wb = utils.book_new();
        const ws = utils.json_to_sheet([]);
        utils.sheet_add_aoa(ws, headings);
        utils.sheet_add_json(ws, productExp, { origin: 'A2', skipHeader: true });
        utils.book_append_sheet(wb, ws, 'Report');
        writeFile(wb, 'Product.xlsx');
    };
    const handleExportCancel = () => {
        setIsExportOpen(false);
    };

    const onExportChange = (e) => {
        setExportType(e.target.value)
    };

    const showImport = () => {
        setIsImportOpen(true);
    };
 
    const handleImportCancel = () => {
        setIsImportOpen(false);
    };

    const handleImport = ($event) => {
        const files = $event.target.files;
        if (files.length) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = read(event.target.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                    const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                    const finalProducts = rows.map(prod => {
                        const price = Number(prod.Markup_Type === "%" ? (prod.Supplier_Price * (1 + (prod.Markup / 100))) : prod.Supplier_Price);
                        const markupValue = Number(prod.Markup_Type === "%" ? (prod.Supplier_Price * (prod.Markup / 100)) : prod.Markup);
                        const referralValue = Number(prod.Referral_Type === "%" ? (prod.Supplier_Price * (prod.Referral / 100)) : prod.Referral);
                        return {
                            _id: prod.ID,
                            title: prod.Product,
                            supplierPrice: prod.Supplier_Price,
                            markup: prod.Markup,
                            markuptype: prod.Markup_Type,
                            referral: prod.Referral && referralValue < markupValue ? prod.Referral : 0,
                            referraltype: prod.Referral_Type ? prod.Referral_Type : "%",
                            price
                        }
                    })
                    setFinalProducts(finalProducts);
                    showImport();
                }
            }
            reader.readAsArrayBuffer(file);
        }
    }

    const handleImportOk = async () => {
        if (finalProducts.length > 0) {
            setImporting(true);
            await updateProducts(finalProducts, user.token).then(res => {
                if (res.data.ok) {
                    setImporting(false);
                    handleImportCancel();
                    setFinalProducts([]);
                }
            });
        }
    }

    return (
        <div>
            {loading && <div align="center"><LoadingOutlined /><br /></div>}
            <div style={{clear: "both"}} />
            {products
                .filter(product => product.page === currentPage)
                .map((product) => (
                    <div
                        key={product._id}
                    >
                        <AdminProdCard
                            product={product}
                            handleDuplicate={handleDuplicate}
                            handleRemove={handleRemove}
                            canEdit={true}
                        />
                    </div>
                ))}
            <div
                className="text-center pt-3 pb-5"
            >
                
                <Pagination
                    onChange={(page, pageSize) => setValues({ ...values, currentPage: page, pageSize })}
                    current={currentPage}
                    pageSize={pageSize}
                    total={itemsCount}
                    style={{float: "right"}}
                />
                <div
                    style={{ float: "right", marginRight: 20 }}
                >
                    Go to page:{" "}
                    <Select
                        value={currentPage}
                        onChange={(value) => setValues({ ...values, currentPage: parseInt(value) })}
                    >
                        {showGoToPage()}
                    </Select>
                </div>
            </div> 
            <br />
            <br />
            {!isMobile && <div className="col-sm-6 offset-3">
                <div className="row">
                    <div className="col-md-6">
                        <div className="input-group">
                            <div className="custom-file">
                                <input type="file" name="file" className="custom-file-input" id="inputGroupFile" required onChange={handleImport}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
                                <label className="custom-file-label" htmlFor="inputGroupFile">Import</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <button onClick={() => showExport()} className="btn btn-primary float-right">
                            Export <i className="fa fa-download"></i>
                        </button>
                    </div>
                </div>
            </div>}
            <br />
            <Modal title="Export Products" visible={isExportOpen} onOk={handleExportOk} onCancel={handleExportCancel}>
                {importing && <div align="center">Loading products... <LoadingOutlined /></div>}
                {!importing && <div align="center">
                    <Radio.Group onChange={onExportChange} defaultValue="all">
                        <Radio.Button value="all" style={{marginBottom: 10}}>Export All Products</Radio.Button><br/>
                        <Radio.Button value="temp">Export Template Only</Radio.Button>
                    </Radio.Group>
                </div>}
            </Modal>
            <Modal title="Import Products" visible={isImportOpen} onOk={handleImportOk} onCancel={handleImportCancel}>
                {importing && <div align="center">Importing... <LoadingOutlined /></div>}
                {!importing && <div align="center">Are you sure you want to import?</div>}
            </Modal>
        </div>
    );
}

export default ProdShowCards;