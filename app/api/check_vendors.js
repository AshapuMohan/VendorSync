
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

// Simple User Schema for checking
const userSchema = new mongoose.Schema({
    username: String,
    role: String,
    isApproved: Boolean,
    verificationStatus: String
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

async function checkVendors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const vendors = await User.find({ role: 'vendor' });
        console.log(`Total Vendors: ${vendors.length}`);

        const approvedVendors = vendors.filter(v => v.isApproved);
        console.log(`Approved Vendors: ${approvedVendors.length}`);

        vendors.forEach(v => {
            console.log(`- ${v.username}: isApproved=${v.isApproved}, status=${v.verificationStatus}`);
        });

        if (approvedVendors.length === 0 && vendors.length > 0) {
            console.log("Approving first vendor for testing...");
            vendors[0].isApproved = true;
            vendors[0].verificationStatus = 'approved';
            await vendors[0].save();
            console.log(`Approved vendor: ${vendors[0].username}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkVendors();
