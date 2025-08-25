import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Function to generate purchase order PDF
export const generatePurchaseOrderPDF = (order, company) => {
  // Initialize jsPDF
  const doc = new jsPDF();
  
  // Make sure jspdf-autotable is properly loaded
  if (!doc.autoTable) {
    console.error('jspdf-autotable is not loaded correctly');
    throw new Error('PDF generation failed - autoTable plugin not available');
  }
  
  // Set document properties
  doc.setProperties({
    title: `Purchase Order - ${order.order_no}`,
    subject: 'Purchase Order',
    author: company?.company_name || 'PO System',
    creator: 'PO Management System'
  });
  
  // Add company logo if available
  if (company?.logo_path) {
    try {
      // Logo positioning
      const apiBaseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      doc.addImage(
        `${apiBaseUrl}${company.logo_path}`, 
        'JPEG', 
        14, 
        10, 
        50, 
        20
      );
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }
  
  // Add company header
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 128);
  doc.text(company?.company_name || 'Company Name', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(0);
  
  const addressLines = company?.address ? company.address.split('\\n') : [];
  let yPos = 25;
  
  addressLines.forEach(line => {
    doc.text(line, 105, yPos, { align: 'center' });
    yPos += 5;
  });
  
  if (company?.mobile) {
    doc.text(`Mobile: ${company.mobile}`, 105, yPos, { align: 'center' });
    yPos += 5;
  }
  
  if (company?.email) {
    doc.text(`Email: ${company.email}`, 105, yPos, { align: 'center' });
    yPos += 5;
  }
  
  if (company?.gst_number) {
    doc.text(`GST: ${company.gst_number}`, 105, yPos, { align: 'center' });
    yPos += 5;
  }
  
  // Add title
  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('PURCHASE ORDER', 105, yPos, { align: 'center' });
  
  // Add order details
  yPos += 15;
  doc.setFontSize(10);
  
  // Left column
  doc.text(`Order No: ${order.order_no}`, 14, yPos);
  doc.text(`Date: ${new Date(order.order_date).toLocaleDateString()}`, 14, yPos + 7);
  
  // Right column
  doc.text(`Customer: ${order.customer}`, 110, yPos);
  doc.text(`Broker: ${order.broker || 'N/A'}`, 110, yPos + 7);
  doc.text(`Mill: ${order.mill || 'N/A'}`, 110, yPos + 14);
  
  // Add product details table
  yPos += 30;
  doc.autoTable({
    startY: yPos,
    head: [['Product', 'Weight', 'Bags', 'Rate', 'Amount']],
    body: [
      [
        order.product || 'N/A',
        order.weight ? `${order.weight} kg` : 'N/A',
        order.bags || 'N/A',
        order.rate ? `₹${order.rate}` : 'N/A',
        order.value ? `₹${order.value}` : 'N/A'
      ]
    ],
    theme: 'striped'
  });
  
  // Add terms and conditions
  if (order.terms_conditions) {
    const finalY = doc.lastAutoTable.finalY || yPos + 30;
    
    doc.text('Terms & Conditions:', 14, finalY + 15);
    doc.setFontSize(9);
    
    const splitText = doc.splitTextToSize(order.terms_conditions, 180);
    doc.text(splitText, 14, finalY + 22);
  }
  
  // Add bank details
  if (company?.bank_details) {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(10);
    doc.text('Bank Details:', 14, pageHeight - 50);
    
    const splitText = doc.splitTextToSize(company.bank_details, 180);
    doc.text(splitText, 14, pageHeight - 45);
  }
  
  // Add signature line
  const pageHeight = doc.internal.pageSize.height;
  doc.text('Authorized Signatory', 170, pageHeight - 20, { align: 'right' });
  doc.line(140, pageHeight - 25, 190, pageHeight - 25);
  
  return doc;
};
