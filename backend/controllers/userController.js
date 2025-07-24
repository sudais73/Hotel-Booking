import UserModel from "../models/User.js";



// api for getting user//
// export const getUserData = async (req,res)=>{
//     try {
//         const role = req.user.role;
//         const recentSearchedCities = req.user.recentSearchedCities;
//         res.json({success:true, role, recentSearchedCities})
//     } catch (error) {
//         console.log(error.message)
//         res.json({success:false, msg:error.message})
//     }
// }

export const getUserData = async (req, res) => {
  try {
    // 1. Get user data from request (set by protect middleware)
    const { role, recentSearchedCities } = req.user;

    // 2. Validate required data exists
    if (typeof role === 'undefined' || !Array.isArray(recentSearchedCities)) {
      return res.status(400).json({
        success: false,
        message: "User data incomplete or malformed"
      });
    }

    // 3. Return user data (sanitize if needed)
    return res.status(200).json({
      success: true,
      data: {
        role,
        recentSearchedCities: recentSearchedCities || [] // Ensure array exists
      }
    });

  } catch (error) {
    console.error("Get user data error:", error);

    // Handle specific error types
    if (error.name === 'TypeError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user data structure"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user data",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




// store user recent searched city//

export const storeRecentSearchedCities = async(req, res )=>{
    try {
        const {recentSearchedCity} = req.body;
        const user = await req.user
        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCity)
        }else {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity)

        }
        await UserModel.save()
         res.json({success:true, msg: 'City Added'})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
    }
};

