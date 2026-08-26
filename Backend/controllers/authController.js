const bcrypt = require("bcryptjs");
const { db, FieldValue } = require("../config/firebase");

// Register customer
const registerCustomer = async (req, res) => {
  const { nic, name, contactNo, email, password } = req.body;

  if (!nic || !name || !email || !password) {
    return res.status(400).json({ error: "All required fields must be filled" });
  }

  try {
    const customersRef = db.collection("customers");

    // Check if NIC already exists
    const nicSnapshot = await customersRef.where("nic", "==", nic).get();
    if (!nicSnapshot.empty) {
      return res.status(400).json({ error: "NIC already exists" });
    }

    // Check if Email already exists
    const emailSnapshot = await customersRef.where("email", "==", email).get();
    if (!emailSnapshot.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = {
      nic,
      name,
      contact_number: contactNo || "",
      email,
      password: hashedPassword,
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await customersRef.add(newCustomer);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: docRef.id, nic, name, email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

// Login user
const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const customersRef = db.collection("customers");
    const snapshot = await customersRef.where("email", "==", email).limit(1).get();

    if (snapshot.empty) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    let userDoc;
    snapshot.forEach((doc) => {
      userDoc = { id: doc.id, ...doc.data() };
    });

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userDoc.id,
        nic: userDoc.nic,
        name: userDoc.name,
        email: userDoc.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
};
