import UserModel from "../models/User.js";



// api for getting user//
export const getUserData = async (req,res)=>{
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({success:true, role, recentSearchedCities})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}





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

