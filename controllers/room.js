import Hotel from "../models/hotel.js";
import Room from "../models/room.js";
import FileService from "../middleware/s3.js";

export const createRoom = async (req, res) => {
  const newRoom = new Room(req.body);

  try {
    const room = await newRoom.save();

    await Hotel.findByIdAndUpdate(req.body.property_id, {
      $push: { rooms: room.id },
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomsByProperyId = async (req, res) => {
  try {
    const rooms = await Room.find({
      property_id: req.params.id,
    });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomGroupsByType = async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      {
        $match: {
          property_id: req.params.id,
        },
      },
      {
        $group: {
          _id: "$room_type",
          rooms: { $push: "$$ROOT" },
        },
      },
    ]);

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomExist = Room.findById(req.params.id);

    if (!roomExist)
      return res
        .status(404)
        .json({ message: `Cannot find room with id ${req.params.id}` });

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Room deleted successfully" });
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
  let imgPath = `https://bloonsoo-images-upload.s3.ap-southeast-1.amazonaws.com/${imgURL}`;


  // const imgPath = `${req.protocol}://${req.get('host')}/public/images/${file.filename}`

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

export const deleteGalleryPhoto = async (req, res) => {
  try {
    console.log("delete a gallery", req.body.imgPath);
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res
        .status(400)
        .json({ message: `Cannot find hotel with id ${req.params.id}` });
    }

    // Find the index of the image in the gallery_images array
    const imageIndex = hotel.gallery_images.findIndex(
      (image) => image === req.body.imgPath
    );

    // Check if the image exists in the array
    if (imageIndex === -1) {
      return res.status(400).json({ message: `Image not found` });
    }

    // Remove the image from the array
    hotel.gallery_images.splice(imageIndex, 1);

    // Save the updated hotel object
    await hotel.save();

    // You can also delete the image file from your server here if needed

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
