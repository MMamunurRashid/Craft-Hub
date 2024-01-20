// import React from 'react';
// import { PDFViewer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
// import { Font } from '@react-pdf/renderer';

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   header: {
//     fontSize: 20,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   label: {
//     fontSize: 12,
//   },
//   value: {
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
// });
// const Invoice = ({ orderForInvoice }) => {
//   Font.register({
//     family: "Times-Roman",
//     fonts: [
//       { src: "https://fonts.gstatic.com/s/timesnewroman/timesnewroman.ttf" },
//       {
//         src: "https://fonts.gstatic.com/s/timesnewroman/timesnewroman-bold.ttf",
//         fontWeight: "bold",
//       },
//     ],
//   });

//   const date = new Date();
//   const options = { timeZone: "Asia/Dhaka" };
//   const localTime = date.toLocaleString("en-US", options);

//   const products = Array.isArray(orderForInvoice.products)
//   ? orderForInvoice.products
//   : [orderForInvoice.products];

// return (
 
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.section}>
//           <Text style={styles.header}>Invoice</Text>
//           <View style={styles.row}>
//             <Text style={styles.label}>Invoice Number:</Text>
//             <Text style={styles.value}>{orderForInvoice.transactionId}</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>Date:</Text>
//             <Text style={styles.value}>{orderForInvoice.date}</Text>
//           </View>
//         </View>
//         <View style={styles.section}>
//           <Text style={styles.header}>Products</Text>
//           {Array.isArray(orderForInvoice.products) ? 
//           products?.map((product, index) => (
//             <View style={styles.row} key={index}>
//               <Text style={styles.label}>{product?.productName}</Text>
//               <Text style={styles.value}>{`${product?.productPrice.toFixed(2)}`}</Text>
//             </View>
//           )) : <View style={styles.row} >
//           <Text style={styles.label}>{orderForInvoice?.products?.productName}</Text>
//           <Text style={styles.value}>{orderForInvoice?.products?.productPrice.toFixed(2)}</Text>
//         </View>}
//           <View style={styles.row}>
//             <Text style={styles.label}>Total Price:</Text>
//             <Text style={styles.value}>
//               {orderForInvoice.totalPrice}
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   )
// };

// export default Invoice;
import React from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

const Invoice = ({ orderForInvoice, localTime }) => {
    Font.register({
    family: "Berkshire Swash",
    fonts: [
      { src: "https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap" },
      
    ],
  });
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    container: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    header: {
      fontSize: 12,
      marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    label: {
      fontSize: 10,
    },
    value: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      
    },
    tableHeader: {
      backgroundColor: '#f0f0f0',
    },
    tableCell: {
      padding: 8,
      
    },
    totalContainer: {
      marginTop: 6,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    totalLabel: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    totalPrice: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#007BFF',
    },
    thankYouMessage: {
      marginTop: 6,
      color: '#666',
      fontSize: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <Text style={{fontSize:'20px'}}>Invoice</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice #{orderForInvoice._id}</Text>
          </View>

          {/* Client Info */}
          <View style={styles.row}>
            <Text style={styles.label}>Bill To:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{orderForInvoice.userName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{orderForInvoice?.location?.district? orderForInvoice?.location?.district : orderForInvoice.location }</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email: {orderForInvoice.userEmail}</Text>
          </View>

          {/* Invoice Details */}
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Details:</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date: {localTime}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date: {orderForInvoice.orderDate}</Text>
          </View>

          {/* Items Table */}
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>Item</Text>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.label}>Quantity</Text>
              <Text style={styles.label}>Unit Price</Text>
              <Text style={styles.label}>Total</Text>
            </View>
            <View style={styles.table}>
             
              {orderForInvoice &&
                orderForInvoice.products &&
                (Array.isArray(orderForInvoice.products) ? (
                  orderForInvoice.products.map((product, index) => (
                    <View key={index} style={styles.row}>
                      <Text style={styles.label}>{index + 1}</Text>
                      <Text style={styles.label}>{product.productName}</Text>
                      <Text style={styles.label}>
                        {product?.quantity ? product.quantity : 1}
                      </Text>
                      <Text style={styles.label}>
                        {`$${product.productPrice.toFixed(2)}`}
                      </Text>
                      <Text style={styles.label}>
                        {`$${(product?.quantity
                          ? product.quantity
                          : 1 * product.productPrice
                        ).toFixed(2)}`}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.row}>
                    <Text style={styles.label}>1</Text>
                    <Text style={styles.label}>
                      {orderForInvoice.products.productName}
                    </Text>
                    <Text style={styles.label}>
                      {orderForInvoice.products?.quantity
                        ? orderForInvoice.products.quantity
                        : 1}
                    </Text>
                    <Text style={styles.label}>
                      {`$${orderForInvoice.products.productPrice.toFixed(2)}`}
                    </Text>
                    <Text style={styles.label}>
                      {`$${(orderForInvoice.products?.quantity
                        ? orderForInvoice.products.quantity
                        : 1 * orderForInvoice.products.productPrice
                      ).toFixed(2)}`}
                    </Text>
                  </View>
                ))}
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalContainer}>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Price:</Text>
              <Text style={styles.totalPrice}>{`${orderForInvoice.price}`} BDT</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total Price (All Included):</Text>
              <Text style={styles.totalPrice}>{`${orderForInvoice.totalPrice}`} BDT</Text>
            </View>
          </View>

          {/* Thank you message */}
          <View style={styles.thankYouMessage}>
            <Text>Thank you for shooping with Craft Hub!</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Invoice;
