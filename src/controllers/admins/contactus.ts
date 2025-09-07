import { Request, Response } from "express";
import { db } from "../../models/db";
import { contactus } from "../../models/schema";
import { SuccessResponse} from "../../utils/response";
import { eq } from "drizzle-orm";
import { NotFound } from "../../Errors";


export const getAllContactMessages = async (req: Request, res: Response) => {

    const messages = await db.select()
      .from(contactus)
      
    
    SuccessResponse(res, { messages }, 200);
 
};

export const getContactMessageById = async (req: Request, res: Response) => {
    const messageId = Number(req.params.id);
    
    if (isNaN(messageId)) {
      throw new NotFound("Invalid message ID");
    }
    
    const [message] = await db.select()
      .from(contactus)
      .where(eq(contactus.id, messageId));
    
    SuccessResponse(res, message, 200);
 
};