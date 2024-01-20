import React from "react";
import { Page, Text, Document, StyleSheet, Font, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontSize: 12,
    flexDirection: "column",
    fontFamily: "Times-Roman",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 15,
  },
  text: {
    margin: 8,
    fontSize: 14,
    textAlign: "justify",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
  },
  productList: {
    marginBottom: 5,
  },
});

const PDF = ({ fromDate, toDate, salesData }) => {
  Font.register({
    family: "Times-Roman",
    fonts: [
      { src: "https://fonts.gstatic.com/s/timesnewroman/timesnewroman.ttf" },
      { src: "https://fonts.gstatic.com/s/timesnewroman/timesnewroman-bold.ttf", fontWeight: "bold" },
    ],
  });

  const productMap = new Map();

  salesData.forEach((data) => {
    if (Array.isArray(data.products)) {
      data.products.forEach((product) => {
        const productName = product.productName;
        productMap.set(productName, (productMap.get(productName) || 0) + 1);
      });
    } else if (data.products && typeof data.products === "object") {
      const productName = data.products.productName;
      productMap.set(productName, (productMap.get(productName) || 0) + 1);
    }
  });

  let totalAmount = 0;
  let totalProducts = 0;
  salesData.forEach((data) => {
    totalAmount += data.totalPrice;

    if (Array.isArray(data.products)) {
      totalProducts += data.products.length;
    } else if (data.products && typeof data.products === 'object') {
      totalProducts += 1;
    }
  });
  const roundedTotalAmount = totalAmount.toFixed(2);

  const productList = [];
  productMap.forEach((count, product) => {
    productList.push({ product, count });
  });

  const chunkSize = 20; // Adjust the number of items per page
  const productChunks = [];
  for (let i = 0; i < productList.length; i += chunkSize) {
    productChunks.push(productList.slice(i, i + chunkSize));
  }

  const date = new Date();
  const options = { timeZone: "Asia/Dhaka" };

  const localTime = date.toLocaleString("en-US", options);
  return (
    <Document>
      {productChunks.map((chunk, pageIndex) => (
        <Page size="A4" key={pageIndex} style={styles.body}>
          <Text style={styles.title}>Sales Report</Text>
          <Text style={styles.text}>Print Time: {localTime}</Text>

          <Text style={styles.text}>
            You requested for {fromDate} to {toDate} sales report
          </Text>
          <Text style={styles.text}>Total Sell Products: {totalProducts}</Text>
          <Text style={styles.text}>
            Total amount of sell: {roundedTotalAmount} BDT
          </Text>
          <Text style={styles.text}>Product List:</Text>
          <View style={styles.productList}>
            {chunk.map((product, index) => (
              <Text key={index}>
                {`${index + 1 + pageIndex * chunkSize}. ${product.product} x${product.count}`}
              </Text>
            ))}
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </Page>
      ))}
    </Document>
  );
};

export default PDF;
