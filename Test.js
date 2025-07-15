let text = "```json saad is *good* ```";

let cleaned = text.replace(/```json|```|\*/g, "");
//let cleaned = text.replace(/```json|```|\*/g, "");
console.log(cleaned.trim());
