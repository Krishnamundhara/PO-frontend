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
  let yPos = 20;

  // Add company logo if available
  if (company?.logo_path) {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      // Center the logo
      doc.addImage(
        `${apiBaseUrl}${company.logo_path}`,
        'JPEG',
        centerX - 25,  // Center the 50-width logo
        yPos,
        50,
        20
      );
      yPos += 25;  // Move down after logo
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }

  // Add company name
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 128);  // Dark blue color
  doc.text(company?.company_name || 'Company Name', centerX, yPos, { align: 'center' });
  yPos += 10;

  // Add address and contact details
  doc.setFontSize(10);
  doc.setTextColor(0);
  
  // Address
  if (company?.address) {
    doc.text(company.address, centerX, yPos, { align: 'center' });
    yPos += 6;
  }

  // Contact details in one line
  let contactLine = [];
  if (company?.mobile) contactLine.push(`Mobile: ${company.mobile}`);
  if (company?.email) contactLine.push(`Email: ${company.email}`);
  if (company?.gst_number) contactLine.push(`GST: ${company.gst_number}`);
  
  if (contactLine.length > 0) {
    doc.text(contactLine.join('    '), centerX, yPos, { align: 'center' });
    yPos += 10;
  }
  
  // Add PURCHASE ORDER heading
  yPos += 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('PURCHASE ORDER', centerX, yPos, { align: 'center' });
  yPos += 15;

  // Set up the order details in two columns
  doc.setFontSize(11);
  const leftX = 20;
  const rightX = pageWidth / 2 + 10;

  // Left column
  doc.text(`Order Number: ${order.order_no}`, leftX, yPos);
  doc.text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, leftX, yPos + 7);

  // Right column
  doc.text(`Customer: ${order.customer}`, rightX, yPos);
  doc.text(`Broker: ${order.broker || 'N/A'}`, rightX, yPos + 7);
  doc.text(`Mill: ${order.mill || 'N/A'}`, rightX, yPos + 14);

  // Add product details table
  yPos += 25;
  doc.autoTable({
    startY: yPos,
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

  // Add terms and conditions
  if (order.terms_conditions) {
    const finalY = doc.lastAutoTable.finalY || yPos + 30;
    doc.setFontSize(11);
    doc.text('Terms & Conditions:', 20, finalY + 15);
    const splitText = doc.splitTextToSize(order.terms_conditions, 170);
    doc.text(splitText, 20, finalY + 25);
  }

  // Add signature line at the bottom
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setLineWidth(0.1);
  doc.line(pageWidth - 60, pageHeight - 30, pageWidth - 20, pageHeight - 30);
  doc.text('Authorized Signatory', pageWidth - 40, pageHeight - 20, { align: 'center' });
  
  // Save the PDF
  doc.save(`PO_${order.order_no}.pdf`);
  return doc;
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Failed to generate PDF. Please try again later.');
    return null;
  }
};
