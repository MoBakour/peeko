// import multer
import multer from "multer";

// create multer instance
const upload = multer({ dest: "./uploads" });

// export instance
export default upload;
