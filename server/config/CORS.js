import cors from "cors";
export default function CORS(){
    return cors({ origin: "http://localhost:5173", credentials: true })
}