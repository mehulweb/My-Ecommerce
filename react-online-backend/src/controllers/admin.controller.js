import UserModel from "../model/user.model.js";

export const deleteUserByAdmin = async (req, res) => {

    const isadmin = await UserModel.findById(req.userId);

    if (isadmin.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const userId = req.params.id;
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }

};

export const getAllUsers = async (req, res) => {

    const isadmin = await UserModel.findById(req.userId);

    if (isadmin.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const users = await UserModel.find();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};