const Pickup = require('../models/Pickup');
const User = require('../models/User');
const nodemailer = require('nodemailer');

let transporter;

// Asynchronously initialize the transporter with a dynamic fallback
(async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    console.log('✅ SMTP Mailer initialized with Production credentials.');
  } else {
    // Generate an Ethereal test account on the fly for development simulations
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, 
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    console.log('⚠️ SMTP Warning: .env missing EMAIL credentials. Running on Ethereal Mocks.');
  }
})();

// @desc    Create new pickup
// @route   POST /api/pickups
// @access  Private
const createPickup = async (req, res) => {
  try {
    const { category, volume, date, position } = req.body;

    if (!category || !volume || !date || !position) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const pickup = await Pickup.create({
      user: req.user.id,
      category,
      volume,
      date,
      position,
      status: 'Pending'
    });

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: `"EcoRoute Dispatch" <${process.env.EMAIL_USER || 'no-reply@ecoroute.com'}>`,
          to: req.user.email,
          subject: 'EcoRoute: Pickup Scheduled Successfully! 🌍',
          html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
                  <h2 style="color: #10b981;">Hello, EcoHero! 🌿</h2>
                  <p>Incredible work taking action to keep our planet clean! A specialized EcoRoute Unit has logged your extraction coordinates.</p>
                  <p><strong>Payload Details:</strong></p>
                  <ul>
                    <li><strong>Category:</strong> ${category}</li>
                    <li><strong>Estimated Volume:</strong> ${volume}</li>
                    <li><strong>Deployment Window:</strong> ${date}</li>
                  </ul>
                  <p>Our autonomous units are standing by. We will email you again when the fleet is 'In-Route'. Thank you for using EcoRoute!</p>
                </div>`
        });
        
        if (!process.env.EMAIL_USER) {
          console.log(`\n📧 [SIMULATED EMAIL SENT TO ${req.user.email}]`);
          console.log(`➡️  View physical email here: ${nodemailer.getTestMessageUrl(info)}\n`);
        } else {
          console.log(`Email dispatched successfully to ${req.user.email}`);
        }
      } catch (emailErr) {
        console.error('Failed to dispatch notification email:', emailErr.message);
      }
    }

    res.status(201).json(pickup);
  } catch (error) {
    console.error('🔥 Error creating pickup:', error.message);
    res.status(500).json({ error: 'Server error creating pickup: ' + error.message });
  }
};

// @desc    Get user pickups
// @route   GET /api/pickups
// @access  Private
const getUserPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(pickups);
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({ error: 'Server error fetching pickups' });
  }
};

// @desc    Get ALL Pickups (Admin only)
// @route   GET /api/pickups/all
const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(pickups);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching global pickups' });
  }
};

// @desc    Update Pickup Status from Admin Console
// @route   PUT /api/pickups/:id/status
const updatePickupStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pickup = await Pickup.findById(req.params.id);

    if (!pickup) return res.status(404).json({ error: 'Order not found' });

    pickup.status = status;
    await pickup.save();

    // Automatically provision +50 Eco Points if the operation is verified as Completed
    if (status === 'Completed') {
      const dbUser = await User.findById(pickup.user);
      if (dbUser) {
        dbUser.points += 50;
        await dbUser.save();
      }
    }

    if (transporter && (status === 'Completed' || status === 'In-Route')) {
      try {
        const dbUser = await User.findById(pickup.user);
        if (dbUser) {
          const info = await transporter.sendMail({
            from: `"EcoRoute Dispatch" <${process.env.EMAIL_USER || 'no-reply@ecoroute.com'}>`,
            to: dbUser.email,
            subject: `EcoRoute: Pickup Status Update -> ${status.toUpperCase()}! 🌍`,
            html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
                    <h2 style="color: #10b981;">Hello, EcoHero! 🌿</h2>
                    <p>Your scheduled payload extraction is now <strong>${status.toUpperCase()}</strong>.</p>
                    ${status === 'Completed' ? '<p>Thank you for protecting the planet! <strong style="color: #10b981;">+50 XP</strong> has been credited to your Global Wallet!</p>' : '<p>Please ensure all materials are packaged securely at the specified coordinates.</p>'}
                    <p>EcoRoute Command</p>
                  </div>`
          });
          if (!process.env.EMAIL_USER) {
            console.log(`\n📧 [SIMULATED COMPLETION EMAIL SENT TO ${dbUser.email}]: ${nodemailer.getTestMessageUrl(info)}\n`);
          }
        }
      } catch (emailErr) {
        console.error('Failed to dispatch status update email:', emailErr.message);
      }
    }

    res.status(200).json(pickup);
  } catch (error) {
    res.status(500).json({ error: 'Server error deploying status change' });
  }
};

module.exports = { createPickup, getUserPickups, getAllPickups, updatePickupStatus };
