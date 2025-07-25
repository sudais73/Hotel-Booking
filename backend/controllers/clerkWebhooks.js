import UserModel from "../models/User.js";
import {Webhook} from 'svix'


const clerkWebhooks = async(req,res)=>{
   
    try {
         console.log("Webhook Payload:", req.body); 
        // create a svix instance with clerk webhook secret//
        const wb = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        // getting headers//
        const headers = {
            'svix-id':req.headers['svix-id'],
            'svix-timestamp':req.headers['svix-timestamp'],
            'svix-signature':req.headers['svix-signature'],
        }
        // verifying headers//
       
        await wb.verify(JSON.stringify(req.body), headers);
       console.log("Webhook verified successfully"); 

        // getting data from req.body//
        const {data,type} = req.body
        const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name + ' ' + data.last_name,
            image:data.image_url,
        }
        // switch cases for different events//
       switch (type) {
    case 'user.created':{
        const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name + ' ' + data.last_name,
            image:data.image_url,
        }
        await UserModel.create(userData)
        break;
    }
    case 'user.updated':{
        const userData = {
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username:data.first_name + ' ' + data.last_name,
            image:data.image_url,
        }
        await UserModel.findByIdAndUpdate(data.id,userData)
        break;
    }
       
    case 'user.deleted':{ 
        await UserModel.findByIdAndDelete(data.id)
        break;
    }
      default:
        break;
}
        res.json({success:true, msg:" Webhook Received"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}

export default clerkWebhooks;
