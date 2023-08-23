import PostModel from "../Models/PostModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";


export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body)

    try {
        await newPost.save()
        res.status(200).json("Post created")
    } catch (error) {
        res.status(500).json(error)
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)

    } catch (error) {
        res.status(500).json(error)
    }
}

export const updatePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json(post)
        } else {
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
        res.status(500).json(error)

    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id
    const { userId } = req.body
    try {
        const post = await PostModel.findById(id)

        if (post.userId === userId) {
            await post.deleteOne()
            res.status(200).json("post deleted")

        } else {
            res.status(403).json("Action forbidden")

        }
    } catch (error) {
        res.status(500).json(error)

    }
}

export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await PostModel.findById(id);

        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        const isLiked = post.likes.includes(userId);

        if (!isLiked) {
            post.likes.push(userId);
        } else {
            const index = post.likes.indexOf(userId);
            post.likes.splice(index, 1);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;

    try {
        const currentUserPosts = await PostModel.find({ userId: userId });
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts",
                },
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0,
                },
            },
        ]);

        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts)
            .sort((a, b) => {
                return b.createdAt - a.createdAt;
            })

        );

    } catch (error) {
        res.status(500).json(error);
    }
};