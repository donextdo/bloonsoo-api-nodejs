import User from '../models/user.js'
import Hotel from '../models/hotel.js'
import sendEmail from "../utils/email/sendEmail.js";
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename)

const adminEmailTemplate = fs.readFileSync(path.join(__dirname, '../utils/email/hotel-admin.ejs'), 'utf-8');

const bloonsoAdmin = process.env.BLOONSOO_ADMIN

const updateUser = async (req, res, next) => {
    try {
        
        const id = req.params.id

        const user = User.findById(id)

        if(!user) return res.status(404).json({
            code: 'NO_USER_FOUND',
            message: `no user found with given id ${id}`
        })

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...req.body
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        const { password, ...userInfo } = updatedUser._doc

        res.status(200).json(userInfo)

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

const getOneUser = async (req, res) => {
    
    const id = req.params.id;
  
    try {
      let user = await User.findOne({
        _id: id,
      });
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).send({ message: "No such user found" });
      }
    } catch (err) {
        
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

const setProfilePic = async (req, res, next) => {
    try {
        const file = req.file

        if(!file) {
            return res.status(400).json({message: "Please add an image"})
        }

        const imgPath = `${req.protocol}://${req.get('host')}/public/profile/${file.filename}`

        const profilePic = {
            profilePic: imgPath
        }

        const id = req.params.id

        const user = User.findById(id)

        if(!user) return res.status(404).json({
            code: 'NO_USER_FOUND',
            message: `no user found with given id ${id}`
        })

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: profilePic
            },
            {
                new: true,
                runValidators: true
            }
        )

        const { password, ...userInfo } = updatedUser._doc

        res.status(200).json(userInfo)

    } catch (error) {
        res.status(500).json(error.message)
    }
}


const addHotelAdmin = async (req, res, next) => {
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: 'hotel-admin'
        })

        const user = await newUser.save()

        const hotel = await Hotel.updateMany(
            {
                _id: { $in: req.body.hotelIds }  
            },
            {
                $set: {
                    user: user._id
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        const data = { username: req.body.username, password: req.body.password, url: bloonsoAdmin};
        const renderedTemplate = ejs.render(adminEmailTemplate, data);

        await sendEmail(
            'Bloonsoo Admin Account Details', 
            user.email,
            renderedTemplate
        )

        res.status(200).json(user)

    }
    catch (error) {
        if (error.code && error.code === 11000) {
            return res.status(400).json({
                duplicate: Object.keys(error.keyValue),
                message: `Duplicate value entered for ${Object.keys(
                    error.keyValue
                  )} field, please choose another value`
            })
        }
        next(error)
    }
}


const totalUsers = async (req, res, next) => {

    try {
        const count = await User.countDocuments()
        console.log("usercount",count)
        res.status(200).json(count)

    }
    catch (error) {
        next(error)
    }
}


const getAllUsers = async (req, res) => {

    try {
   
        
        const users = await User.find()

        res.status(200).json(users)

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
        
    }
}

export const activeUserCount = async (req, res, next) => {
    try {
      const count = await User.countDocuments({
        status: "active",
      });
  
      res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  };

const searchUser = async (req, res, next) => {
    try {

        const query = req.body.query
        
        const users = await User.find({
            $or: [
                {username: { $regex: `${query}`, $options: 'i' }},
                {email: { $regex: `${query}`, $options: 'i' }}
            ]
        })

        res.status(200).json(users)

    } catch (error) {
        next(error)
    }
}

const assignHotels = async (req, res, next) => {
    try {
        
        const userId = req.body.userId
        const hotelIds = req.body.hotelIds

        console.log('userId', userId)

        const user = await User.findByIdAndUpdate(
            userId.toString(),
            {
                $set: {
                    role: 'hotel-admin'
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        const hotel = await Hotel.updateMany(
            {
                _id: { $in: hotelIds }  
            },
            {
                $set: {
                    user: user._id
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json(user)

    } catch (error) {
        if (error.code && error.code === 11000) {
            return res.status(400).json({
                duplicate: Object.keys(error.keyValue),
                message: `Duplicate value entered for ${Object.keys(
                    error.keyValue
                  )} field, please choose another value`
            })
        }
        next(error)
    }
}

const addWishList = async (req, res) => {
    try {
  
      const user = await User.findById(req.params.id);
      console.log("user", user);
      const hotels = req.body.whishList;
  
      const hotelList = hotels.map((p) => ({
        hotelId: p.hotelId,
        image: p.image,
        title: p.title,
        address: p.address,
        
      }));
  
      user.whishList.push(...hotelList);
  
      await user.save();
  
      res.status(200).json({ message: "Hotel added to wishlist" });
    } catch (err) {
      console.error(err);
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }else{
        console.log("error is $err", err);
      }
      res.status(500).json({ message: "Server error" });
    }
  };

  const deleteFromWishList = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      // Remove the product from the wishlist array
      user.whishList = user.whishList.filter(
        (product) => product.productId !== req.params.productId
      );
  
      await user.save();
  
      res.status(200).json({ message: "Product removed from wishlist" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  const inactiveUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: `cannot find user with id ${req.params.id}`,
            });

        await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: "inactive",
                },
            },

        );

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};

const activeUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: `cannot find user with id ${req.params.id}`,
            });

        await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {

                    status: "active",
                },
            },

        );

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const setAdminUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: `Cannot find user with id ${req.params.id}`,
            });

        user.role = "admin"; // Update the user's role directly

        await user.save(); // Save the updated user

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};

const setHotelAdminUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: `cannot find user with id ${req.params.id}`,
            });

        await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {

                    role: "hotel-admin",
                },
            },

        );

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({
                code: "NOT_FOUND",
                message: `Cannot find user with id ${req.params.id}`,
            });

        await user.remove(); // Delete the user

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};



export default {
    updateUser,
    setProfilePic,
    addHotelAdmin,
    totalUsers,
    getAllUsers,
    searchUser,
    assignHotels,
    getOneUser,
    addWishList,
    deleteFromWishList,
    activeUserCount,
    inactiveUser,
    activeUser,
    setAdminUser,
    setHotelAdminUser,
    deleteUser
}