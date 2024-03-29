import Hotel from "../models/hotel.js";
import User from "../models/user.js";
import socketIOClient from "socket.io-client";
import FileService from "../middleware/s3.js";

export const createHotel = async (req, res) => {
  const newHotel = new Hotel({
    user: req.user._id.toString(),
    property_name: req.body.property_name,
    star_rating: req.body.star_rating,
    contact_name: req.body.contact_name,
    contact_phone_number: req.body.contact_phone_number,
    contact_phone_number_alternative: req.body.contact_phone_number_alternative,
    is_own_multiple_hotels: req.body.is_own_multiple_hotels,
    use_channel_manager: req.body.use_channel_manager,
    property_address: req.body.property_address,
    about: req.body.about,
  });

  try {
    const hotel = await newHotel.save();

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setCoverPhoto = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Please add an image" });
  }

  const imgURL = await FileService.uploadFile(req, res);
  let imgPath = `https://bloonsoo-images-upload.s3.ap-southeast-1.amazonaws.com/${imgURL}`


  const coverImg = {
    cover_image: imgPath,
  };

  try {
    const hotelExist = await Hotel.findById(req.params.id);

    if (!hotelExist)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: coverImg,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addGalleryPhotos = async (req, res) => {
  const file = req.file;
  
  if (!file) {
    return res.status(400).json({ message: "Please add an image" });
  }

  const imgURL = await FileService.uploadFile(req, res);
  let imgPath = `https://bloonsoo-images-upload.s3.ap-southeast-1.amazonaws.com/${imgURL}`
  

  try {
    const hotelExist = await Hotel.findById(req.params.id);

    if (!hotelExist)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { gallery_images: imgPath },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(imgPath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFacilities = async (req, res) => {
  try {
    const hotelExist = await Hotel.findById(req.params.id);

    if (!hotelExist)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPolicies = async (req, res) => {
  console.log("hi");
  const policies = {
    policies: req.body,
  };

  try {
    const hotelExist = await Hotel.findById(req.params.id);

    if (!hotelExist)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: policies,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(hotel);
  } catch (error) {
    console.log("hii");
    res.status(500).json({ message: error.message });
  }
};

export const finalize = async (req, res) => {
  try {
    const hotelExist = await Hotel.findById(req.params.id);

    if (!hotelExist)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllHotels = async (req, res) => {
  console.log("bbbbbbbbbbbbbbbbbbbbbbb")
  try {
    const hotels = await Hotel.find({
      $and: [{ is_open_to_bookings: true }, { status: "active" }],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("rooms");

    if (!hotel)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `cannot find hotel with id ${req.params.id}`,
      });

    await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "active",
        },
      },
      {
        runValidators: true,
      }
    );

    await User.findByIdAndUpdate(
      hotel.user,
      {
        $set: {
          role: "admin",
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `cannot find hotel with id ${req.params.id}`,
      });

    await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "rejected",
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const inactiveHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `cannot find hotel with id ${req.params.id}`,
      });

    await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: "inactive",
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res
        .status(404)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });

    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Hotel deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const publishHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `cannot find hotel with id ${req.params.id}`,
      });

    console.log(hotel.user);

    if (req.user._id.toString() !== hotel.user.toString()) {
      return res.status(403).json({
        code: "UNAUTHORIZED",
        message: "You are not allowed to do this",
      });
    }
    // else if (req.user.role !== 'admin') {
    //     return res.status(403).json({
    //         code: 'UNAUTHORIZED',
    //         message: 'You are not allowed to do this'
    //     })
    // }

    await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          is_open_to_bookings: true,
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const unPublishHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `cannot find hotel with id ${req.params.id}`,
      });

    console.log(req.user._id);
    console.log(req.user.role);

    if (req.user._id.toString() !== hotel.user.toString()) {
      return res.status(403).json({
        code: "UNAUTHORIZED",
        message: "You are not allowed to do this",
      });
    }
    // else if (req.user.role !== 'admin') {
    //     return res.status(403).json({
    //         code: 'UNAUTHORIZED',
    //         message: 'You are not allowed to do this'
    //     })
    // }

    await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          is_open_to_bookings: false,
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getHotels = async (req, res, next) => {
  console.log("hi")
  try {
    const hotels = await Hotel.find()
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: ["username", "firstName", "lastName"],
      });

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getMyHotels = async (req, res, next) => {
  
  console.log("user",req.user._id)
  console.log("id",req._id)
  try {
    const hotels = await Hotel.find({
      user: req.user._id.toString(),
    }).populate({
      path: "user",
      select: ["username", "firstName", "lastName"],
    });

    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const activeHotelCount = async (req, res, next) => {
  try {
    const count = await Hotel.countDocuments({
      status: "active",
    });

    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};

export const inactiveHotelCount = async (req, res, next) => {
  try {
    const count = await Hotel.countDocuments({
      status: "inactive",
    });

    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};

export const getAnnonymousHotels = async (req, res, next) => {
  try {
    const hotelList = await Hotel.find({
      $or: [
        { user: { $exists: false } },
        { user: { $eq: null } },
        { user: { $type: "undefined" } },
      ],
    }).select({
      _id: true,
      property_name: true,
      property_address: true,
    });

    res.status(200).json(hotelList);
  } catch (error) {
    next(error);
  }
};

export const searchHotels = async (req, res, next) => {
  try {
    const query = req.body.query;

    const hotels = await Hotel.find({
      $and: [
        {
          "property_address.street_address": {
            $regex: `${query}`,
            $options: "i",
          },
        },
        { is_open_to_bookings: true },
        { status: "active" },
      ],
    });

    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const searchHotelByName = async (req, res, next) => {
  try {
    const query = req.body.query;

    const hotels = await Hotel.find({
      property_name: { $regex: `${query}`, $options: "i" },
    });

    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      hotel,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const searchBySocket = async (req, res) => {
  const { query } = req.body;

  // Create a Socket.io client
  const socket = socketIOClient("http://localhost:5000");

  // Socket.io event listener for search results
  socket.on("searchResults", (results) => {
    console.log("Received search results:", results);

    // Send the search results back to the client
    res.status(200).json(results);

    // Disconnect the Socket.io client
    socket.disconnect();
  });

  // Send the search query to the server
  socket.emit("search", query);
};

export const specialCommissionHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res.status(404).json({
        code: "NOT_FOUND",
        message: `cannot find hotel with id ${req.params.id}`,
      });

    await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          special_commission: req.body.special_commission,
        },
      },
      {
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
