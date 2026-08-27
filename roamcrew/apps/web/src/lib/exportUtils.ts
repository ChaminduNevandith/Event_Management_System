import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export function exportExpensesToCSV(expenses: any[], tripName: string) {
  if (!expenses || expenses.length === 0) {
    alert("No expenses to export.");
    return;
  }

  const headers = ["Description", "Amount", "Paid By", "Date"];
  const rows = expenses.map(exp => [
    `"${exp.description.replace(/"/g, '""')}"`,
    exp.amount,
    `"${(exp.paidBy?.firstName || '')} ${(exp.paidBy?.lastName || '')}"`.trim(),
    exp.createdAt ? format(new Date(exp.createdAt), 'yyyy-MM-dd') : ''
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(e => e.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${tripName.replace(/\s+/g, '_')}_Expenses.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportExpensesToPDF(expenses: any[], tripName: string) {
  if (!expenses || expenses.length === 0) {
    alert("No expenses to export.");
    return;
  }

  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(12, 74, 110); // #0C4A6E
  doc.text(`${tripName} - Expenses`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), 'MMM dd, yyyy')}`, 14, 30);

  const tableColumn = ["Description", "Amount", "Paid By", "Date"];
  const tableRows = expenses.map(exp => [
    exp.description,
    `$${Number(exp.amount).toFixed(2)}`,
    `${exp.paidBy?.firstName || ''} ${exp.paidBy?.lastName || ''}`.trim(),
    exp.createdAt ? format(new Date(exp.createdAt), 'MMM dd, yyyy') : ''
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] }, // #0EA5E9
    styles: { fontSize: 10, cellPadding: 5 },
  });

  const totalAmount = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  
  const finalY = (doc as any).lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Expenses: $${totalAmount.toFixed(2)}`, 14, finalY + 10);

  doc.save(`${tripName.replace(/\s+/g, '_')}_Expenses.pdf`);
}

export function exportItineraryToPDF(itinerary: any[], tripName: string) {
  if (!itinerary || itinerary.length === 0) {
    alert("No itinerary events to export.");
    return;
  }

  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(12, 74, 110); 
  doc.text(`${tripName} - Itinerary`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), 'MMM dd, yyyy')}`, 14, 30);

  // Group itinerary by date
  const groupedEvents: Record<string, any[]> = {};
  itinerary.forEach(event => {
    const dateStr = format(new Date(event.startTime), 'yyyy-MM-dd');
    if (!groupedEvents[dateStr]) groupedEvents[dateStr] = [];
    groupedEvents[dateStr].push(event);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();

  let currentY = 40;

  sortedDates.forEach(date => {
    // Add Date Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(14, 165, 233);
    doc.text(format(new Date(date), 'EEEE, MMM dd, yyyy'), 14, currentY);
    
    currentY += 6;

    const events = groupedEvents[date].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    const tableColumn = ["Time", "Title", "Location", "Notes"];
    const tableRows = events.map(event => [
      `${format(new Date(event.startTime), 'h:mm a')} - ${format(new Date(event.endTime), 'h:mm a')}`,
      event.title,
      event.location || '-',
      event.notes || '-'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: currentY,
      theme: 'striped',
      headStyles: { fillColor: [14, 165, 233] },
      styles: { fontSize: 10 },
      margin: { top: 10, bottom: 10 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Add new page if close to bottom
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
  });

  doc.save(`${tripName.replace(/\s+/g, '_')}_Itinerary.pdf`);
}
