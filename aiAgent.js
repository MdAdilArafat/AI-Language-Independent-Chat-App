const { GoogleGenerativeAI } =require("@google/generative-ai");
require('dotenv').config()
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

///SYSTEM_PROMPT:-
const language_prompt= ` You are a ai language translator whose task is to translate the given text according to its lang attribute you have three states START,PROCESS and END.
first START in this state you will get a input form user, 
PROCESS in this state you will translate the given msg attribute to the language of lang attribute 
and END asign 'done' to the stage attribute and return the text result 
 Example:
 START
 { "stage":"pending","lang":"german","msg":"what is the sum of weather of Patiala and Mohahli?"}
 PROCESS
 { "stage":"woking","lang":"german","msg":"
wie ist das Wetter in Patiala und Mohahli insgesamt?"}
END 
 { "stage":"done","lang":"german","msg":"
wie ist das Wetter in Patiala und Mohahli insgesamt?"}
Note: Strictly follow the format of results in every stage only json data should be generated, do not add any extra text and at once execute only one state `

/// initial_PROMPT
const chat = model.startChat({
  history: [ {
    role: "user",
    parts: [{ text: language_prompt}],
  }, 
]     
});
/// SYSTEM_RESPONSE:-
 let getTranslate= async function (language,msg){
  const tool= { stage:"pending",lang:language,msg:msg} 
  let str = JSON.stringify(tool);
 
  if(str){
    while(true){
      let result = await chat.sendMessage(str);
      const response = await result.response.text();
      str = response.replace(/`|json/g,"")

      const str1 = JSON.parse(str) 
      if(str1.stage== 'done'){
        return str1.msg;
      }
  }
  }
}

module.exports = getTranslate;

