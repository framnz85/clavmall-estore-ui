import React from "react";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";

const Invoice = ({ order }) => {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>
          ~ {new Date().toLocaleString()} ~
        </Text>
        <Text style={styles.title}>Order Details </Text>
        <Text style={styles.author}>(Code: {order._id} )</Text>
        <Text style={styles.subtitle}>Order Summary</Text>

        <Table>
          <TableHeader>
            <TableCell>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total</TableCell>
          </TableHeader>
        </Table>

        <Table data={order.products}>
          <TableBody>
            <DataTableCell getContent={(x) => x.product.title} />
            <DataTableCell getContent={(x) => `P${x.price}`} />
            <DataTableCell getContent={(x) => x.count} />
            <DataTableCell getContent={(x) => `P${x.price * x.count}`} />
          </TableBody>
        </Table>

        <Text style={styles.subtotal}>Sub Total: {`P${order.cartTotal}`}</Text>
        <Text style={styles.total}>Delivery Fee: {`P${order.delfee}`}</Text>
        <Text style={styles.total}>Service Fee: {`P${order.servefee}`}</Text>
        <Text style={styles.total}>Discount: {`-P${order.discount}`}</Text>
        <Text style={styles.total}>Grand Total: {`P${order.grandTotal}`}</Text>

        <Text style={styles.footer}> ~ Thank you for shopping with us ~ </Text>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  subtotal: {
    marginTop: 20,
    fontSize: 12,
    marginBottom: 5,
    textAlign: "right",
  },
  total: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: "right",
  },
  footer: {
    padding: "100px",
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

export default Invoice;
