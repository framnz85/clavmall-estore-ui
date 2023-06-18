import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="container pb-3 mt-3">
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td align="center">
              <Link className="text-secondary" to="/about">
                <h6>About Us</h6>
              </Link>
            </td>
            <td align="center">
              <Link className="text-secondary" to="/services">
                <h6>Services</h6>
              </Link>
            </td>
            <td align="center">
              <Link className="text-secondary" to="/contact">
                <h6>Contact Us</h6>
              </Link>
            </td>
            <td align="center">
              <Link className="text-secondary" to="/social">
                <h6>Social Media</h6>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Footer;
