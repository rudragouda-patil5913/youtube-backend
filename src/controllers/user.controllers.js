import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  const inputDetail = [username, email, fullname, password].some((field) => {
    field?.trim() === "";
  });
  if (inputDetail) {
    throw new ApiError(401, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(401, "User Already existed");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new ApiError(500, "Failed to upload avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Uploaded CoverImage", coverImage);
  } catch (error) {
    console.log("Error uploading CoverImage", error);
    throw new ApiError(500, "Failed to upload CoverImage");
  }

  try {
    const user = await User.create({
      fullname,
      username: username.toLowerCase(),
      email,
      password,
      avatar: avatar.url,
      coverImage: coverImage.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went Wrong in registering user");
    }

    res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Registered successfully"));
  } catch (error) {
    console.log("User creation is Failed");
    if (avatar) {
      await deleteFromCloudinary(avatar.pubilc_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.pubilc_id);
    }
    throw new ApiError(
      500,
      "Something went Wrong in registering user adn images were deleted"
    );
  }
});

export { registerUser };
