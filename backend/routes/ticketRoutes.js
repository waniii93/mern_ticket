import express from "express";

import { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, addTicketReply, getTicketReplies } from "../controller/ticketController.js"
import verifyToken from "../middleware/verifyToken.js";

const route = express.Router();

route.post("/add/ticket", verifyToken, createTicket)
route.get("/tickets", getAllTickets)
route.get("/ticket/:id", getTicketById)
route.put("/update/ticket/:id", updateTicket)
route.delete("/delete/ticket/:id", deleteTicket)
route.post("/ticket/replies/:id", addTicketReply)
route.get("/ticket/replies/:id", getTicketReplies)

export default route;