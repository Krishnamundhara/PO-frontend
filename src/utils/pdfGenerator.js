import { jsPDF } from 'jspdf';
// Explicitly import jspdf-autotable with require
require('jspdf-autotable');

// Function to generate purchase order PDF
export const generatePurchaseOrderPDF = (order, company) => {
  try {
    // Initialize jsPDF
    const doc = new jsPDF();
    
    // Make sure jspdf-autotable is properly loaded
    if (!doc.autoTable) {
      console.error('jspdf-autotable is not loaded correctly');
      alert('Cannot generate PDF: Required plugin not available. Please contact support.');
      return; // Exit early instead of throwing error
    }
  
  // Set document properties
  doc.setProperties({
    title: `Purchase Order - ${order.order_no}`,
    subject: 'Purchase Order',
    author: company?.company_name || 'PO System',
    creator: 'PO Management System'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let yPos = 10;

  // Add Sanskrit text "श्री गणेशाय नमः"
  doc.setFontSize(12);
  doc.setTextColor(255, 0, 0); // Red color for Sanskrit text
  doc.text("श्री गणेशाय नमः", centerX, yPos, { align: 'center' });
  yPos += 12;

  // Create a horizontal layout with logo on left and company name on right
  const leftMargin = 30; // Left margin for logo
  
  // Add company logo if available
  if (company?.logo_path) {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      // Position logo on the left
      doc.addImage(
        `${apiBaseUrl}${company.logo_path}`,
        'JPEG',
        leftMargin,
        yPos,
        30, // Logo width - smaller
        15  // Logo height - smaller
      );
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  // Add company name to the right of the logo
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0); // Black color for company name
  doc.text(company?.company_name || 'Company Name', leftMargin + 40, yPos + 10); // Position to the right of logo
  
  yPos += 20; // Move down after logo and company name row

  // Add address and contact details
  doc.setFontSize(8);
  doc.setTextColor(0);
  
  // Address
  if (company?.address) {
    doc.text(company.address, centerX, yPos, { align: 'center' });
    yPos += 5;
  }

  // Contact details in one line
  let contactLine = [];
  if (company?.mobile) contactLine.push(`Mobile: ${company.mobile}`);
  if (company?.email) contactLine.push(`Email: ${company.email}`);
  if (company?.gst_number) contactLine.push(`GST: ${company.gst_number}`);
  
  if (contactLine.length > 0) {
    doc.text(contactLine.join('    '), centerX, yPos, { align: 'center' });
    yPos += 7;
  }
  
  // Add PURCHASE ORDER heading
  yPos += 8;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('PURCHASE ORDER', centerX, yPos, { align: 'center' });
  yPos += 10;

  // Set up the order details in two side-by-side columns
  doc.setFontSize(10);
  const leftX = 20;
  const rightX = pageWidth / 2 + 30;

  // Left column - Customer details
  doc.text(`Customer: ${order.customer}`, leftX, yPos);
  doc.text(`Broker: ${order.broker || 'N/A'}`, leftX, yPos + 5);
  doc.text(`Mill: ${order.mill || 'N/A'}`, leftX, yPos + 10);

  // Right column - Order details (aligned to right)
  const orderNumText = `Order Number: ${order.order_no}`;
  const dateText = `Date: ${new Date(order.order_date).toLocaleDateString()}`;
  
  doc.text(orderNumText, pageWidth - 20, yPos, { align: 'right' });
  doc.text(dateText, pageWidth - 20, yPos + 5, { align: 'right' });

  // Add product details table
  yPos += 15;
  doc.autoTable({
    startY: yPos,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 9 },
    head: [['Product', 'Weight', 'Bags', 'Rate']],
    body: [
      [
        order.product || 'N/A',
        order.weight ? `${order.weight} kg` : 'N/A',
        order.bags || 'N/A',
        order.rate ? `₹${order.rate}` : 'N/A'
      ]
    ],
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 5,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    }
  });

  // Add bank details if available
  if (company?.bank_details) {
    const finalY = doc.lastAutoTable.finalY || yPos + 20;
    doc.setFontSize(9);
    doc.text('Bank Details:', 20, finalY + 10);
    doc.setFontSize(8);
    const bankText = doc.splitTextToSize(company.bank_details, 170);
    doc.text(bankText, 20, finalY + 18);
  }

  // Add terms and conditions
  let termsY = doc.lastAutoTable.finalY || yPos + 20;
  if (company?.bank_details) {
    // If there are bank details, position terms below them
    const bankText = doc.splitTextToSize(company.bank_details, 170);
    termsY += 20 + bankText.length * 4;
  }
  
  if (order.terms_conditions) {
    doc.setFontSize(9);
    doc.text('Terms & Conditions:', 20, termsY + 10);
    doc.setFontSize(8);
    const splitText = doc.splitTextToSize(order.terms_conditions, 170);
    doc.text(splitText, 20, termsY + 18);
  }

  // Add signature line at the bottom right
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setLineWidth(0.1);
  doc.line(pageWidth - 50, pageHeight - 20, pageWidth - 20, pageHeight - 20);
  doc.setFontSize(8);
  doc.text('Authorized Signatory', pageWidth - 35, pageHeight - 12, { align: 'center' });
  
  // Save the PDF
  doc.save(`PO_${order.order_no}.pdf`);
  return doc;
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again later.');
    return null;
  }
};
