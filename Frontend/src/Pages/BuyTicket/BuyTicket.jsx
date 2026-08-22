import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import backgroundImage from "../../assets/Images/Bgimage.jpg";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const BuyTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(event.ticketprice || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [customerName, setCustomerName] = useState(""); // New state for customer name
  const [customerNIC, setCustomerNIC] = useState(""); // New state for customer NIC

  useEffect(() => {
    // Retrieve user name and NIC from local storage
    const name = localStorage.getItem('userFullName');
    const nic = localStorage.getItem('userNIC');
    if (name) setCustomerName(name);
    if (nic) setCustomerNIC(nic);
  }, []);

  useEffect(() => {
    setTotalPrice(quantity * (event.ticketprice || 0));
  }, [quantity, event.ticketprice]);

  // Generate QR code and return a promise
  const generateQRCode = (ticketDetails) => {
    return QRCode.toDataURL(JSON.stringify(ticketDetails), {
      errorCorrectionLevel: 'H',
    });
  };

  const handleGeneratePDF = async () => {
    const ticketDetails = {
      customerName, // Use the retrieved customer name
      customerNIC, // Include NIC in the ticket details
      eventName: event.event_name || "N/A",
      price: event.ticketprice || "N/A",
      quantity,
      totalPrice,
      date: event.event_date || "N/A",
      time: event.event_time || "N/A",
      venue: event.venue || "N/A",
      description: event.description || "N/A",
    };

    try {
      const qrCodeDataUrl = await generateQRCode(ticketDetails);
      setQrCodeUrl(qrCodeDataUrl);

      const doc = new jsPDF("p", "mm", "a4");

      // Header
      doc.setFillColor(30, 30, 30); // Dark background
      doc.rect(0, 0, 210, 40, "F"); // Header background
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("Event Ticket", 105, 20, { align: "center" });

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 45, 190, 45);

      // Ticket Information Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Ticket Information", 20, 55);

      // Ticket details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      let y = 65;

      const ticketFields = [
        ["Customer Name", ticketDetails.customerName],
        ["Customer NIC", ticketDetails.customerNIC], // Add NIC to the ticket fields
        ["Event Name", ticketDetails.eventName],
        ["Date", ticketDetails.date],
        ["Time", ticketDetails.time],
        ["Venue", ticketDetails.venue],
        ["Description", ticketDetails.description],
        ["Price per Ticket", `${ticketDetails.price} LKR`],
        ["No Tickets", `${ticketDetails.quantity}`],
        ["Total Price", `${ticketDetails.totalPrice} LKR`],
      ];

      ticketFields.forEach(([label, value]) => {
        doc.setTextColor(80, 80, 80);
        doc.text(`${label}:`, 20, y);
        doc.setTextColor(0, 0, 0);
        doc.text(value, 70, y);
        y += 8;
      });

      // QR Code Section
      if (qrCodeDataUrl) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Scan for Details", 160, 55);
        doc.addImage(qrCodeDataUrl, "PNG", 150, 60, 50, 50); // Position QR on right side
      }

      // Footer with Additional Info
      doc.setFillColor(240, 240, 240);
      doc.rect(0, 280, 210, 17, "F");
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(
        "Thank you for your purchase! Please bring a printed or digital copy of this ticket to the event.",
        105,
        288,
        { align: "center" }
      );

      const pdfBlob = doc.output("blob");
      const generatedPdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(generatedPdfUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-100 lg:flex-row">
      {/* Left Section (Image) */}
      <div
        className={`bg-center bg-cover lg:w-1/2 h-1/2 lg:h-full ${isModalOpen ? "blur-sm" : ""
          }`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="p-6">
          <button
            className="w-10 h-10 bg-white rounded-full lg:w-12 lg:h-12 hover:bg-black hover:text-white hover:border hover:border-white"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIosNewIcon />
          </button>
        </div>
      </div>

      {/* Right Section (Ticket Details) */}
      <div
        className={`flex flex-col items-center justify-center p-8 lg:w-1/2 ${isModalOpen ? "blur-sm" : ""
          }`}
      >
        <div className="w-full max-w-md">
          <h1 className="mb-6 text-2xl font-bold text-center">BUY TICKET</h1>
          <div className="p-6">

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">CUSTOMER NAME</h2>
              <p>{customerName || "N/A"}</p> {/* Updated customer name */}
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">CUSTOMER NIC</h2>
              <p>{customerNIC || "N/A"}</p> {/* Display NIC */}
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">EVENT NAME</h2>
              <p>{event.event_name || "N/A"}</p>
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">DATE</h2>
              <p>{event.event_date ? new Date(event.event_date).toISOString().split("T")[0] : "N/A"}</p>
            </div>

            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">TIME</h2>
              <p>{event.event_time || "N/A"}</p>
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">VENUE</h2>
              <p>{event.venue || "N/A"}</p>
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="mr-12 font-semibold">DESCRIPTION</h2>
              <p className="break-words" style={{ wordBreak: "break-word" }}>
                {event.description || "N/A"}
              </p>
            </div>
            <hr className="mb-2 border-gray-600" />


            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">PRICE PER TICKET</h2>
              <p>{event.ticketprice || "N/A"} LKR</p>
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">NO TICKETS</h2>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-1/2 p-2 text-center border border-gray-300 rounded"
              />
            </div>
            <hr className="mb-2 border-gray-600" />

            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">TOTAL PRICE</h2>
              <p>{totalPrice} LKR</p>
            </div>
            <hr className="mb-10 border-gray-600" />

            <div className="flex justify-end">
              <button
                className="flex items-center px-6 py-2 text-white bg-black rounded-md hover:bg-white hover:text-black hover:border hover:border-black"
                onClick={handleGeneratePDF}
              >
                BUY TICKET
                <ShoppingCartIcon className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for PDF preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-xl font-bold text-gray-700 top-2 right-2 hover:text-red-600"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <iframe
              src={pdfUrl}
              width="100%"
              height="500px"
              title="PDF Preview"
              className="border"
            ></iframe>
            <div className="flex justify-end mt-4 ">
              <a
                href={pdfUrl}
                download="ticket.pdf"
                className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyTicket;
