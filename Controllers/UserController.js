import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        if (user) {
            const { password, ...orther } = user._doc
            res.status(200).json(orther);
        }
    } catch (error) {
        res.status(500).json(error);
    }

}

export const updateUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserid, currentUserAdminStatus, password } = req.body;

    if (id === currentUserid || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("access denied");
    }
};
export const deleteUser = async (req, res) => {
    const id = req.params.id;
    const { currentUserid, currentUserAdminStatus } = req.body;
    // res.status(500).json(currentUserid);
    console.log(id)
    console.log(currentUserid)
    console.log(currentUserAdminStatus)
    if (id == currentUserid && currentUserAdminStatus) {
        try {

            const user = await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("access denied");
    }
};

export const followUser = async (req, res) => {
    const id = req.params.id

    const { currentUserid } = req.body
    if (currentUserid === id) {
        res.status(403).json("Action forbidden");

    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserid)
            console.log(followUser)
            console.log(followingUser)
            if (!followUser.followuers.includes(currentUserid)) {
                await followUser.updateOne({ $push: { followuers: currentUserid } })
                await followingUser.updateOne({ $push: { following: id } })

                res.status(200).json("User followed");

            } else {
                res.status(403).json("User is Already folowed by you");

            }
        } catch (error) {
            res.status(500).json(error);
        }
    }


}

export const UnFollowUser = async (req, res) => {
    const id = req.params.id

    const { currentUserid } = req.body
    if (currentUserid === id) {
        res.status(403).json("Action forbidden");

    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(currentUserid)
            console.log(followUser)
            console.log(followingUser)
            if (followUser.followuers.includes(currentUserid)) {
                await followUser.updateOne({ $pull: { followuers: currentUserid } })
                await followingUser.updateOne({ $pull: { following: id } })

                res.status(200).json("User Unfollowed");

            } else {
                res.status(403).json("You not follow him");

            }
        } catch (error) {
            res.status(500).json(error);
        }
    }


}