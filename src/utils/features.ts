import axios from "axios";
import { generate } from "random-words";

import _ from "lodash"

export const countMatchingElements = (userAnswers:string[] , correctAnswers:string[]):number =>{
    if(userAnswers.length!==correctAnswers.length) 

    throw new Error("Arrays not Equal")

    let matchCount = 0;

    for(let i=0; i<userAnswers.length;i++)
    {
        if(userAnswers[i]===correctAnswers[i]) matchCount++;
    }
    return matchCount;
}

const generateOptions = (meaning :{
    Text : string
}[],idx : number):string[] =>{

    const correctAns:string = meaning[idx].Text;

    const allMeaningExceptForCorrect = meaning.filter(i=>i.Text!==correctAns)
    
    const incorrectOptions:string[] = _.sampleSize(allMeaningExceptForCorrect,3).map(i=>i.Text)

    const mcqOptions = _.shuffle([...incorrectOptions,correctAns])
    return mcqOptions;
}
export const translateWords = async (params: LangType):Promise<WordType[]> => {
  try {
    const words = (generate(8) as string[]).map((word) => ({
      Text: word,
    }));
    console.log(words);

    const response = await axios.post(
      "https://microsoft-translator-text.p.rapidapi.com/translate",
      words,
      {
        params: {
          "to[0]": params,
          "api-version": "3.0",
          profanityAction: "NoAction",
          textType: "plain",
        },
        headers: {
          "X-RapidAPI-Key":
            "4beecf9fdfmshec9bd050c602a97p177176jsn8b552127d8e0",
          "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
        },
      }
    );
    console.log(response.data)
    const receive: FetchedDataType[] = response.data;
    const arr: WordType[] = receive.map((i, idx) => {
   
      const options:string[] = generateOptions(words,idx)
      return {
        word: i.translations[0].text,
        meaning: words[idx].Text,
        options: options
      };
    });
    return arr;
  } catch (err) {
    console.log(err);
    throw new Error("Some Error");
  }
};

export const fetchAudio = async(text:string,language:LangType):Promise<string> =>{

    const {VITE_TEXT_TO_SPEECH_API_KEY,VITE_RAPID_KEY} = import.meta.env

    console.log(VITE_TEXT_TO_SPEECH_API_KEY,VITE_RAPID_KEY)

   const encodedParams = new URLSearchParams({
     src: text,
     r: "0",
     c: "mp3",
     f: "8khz_8bit_mono",
     b64: "true",
   });

   if (language === "ja") encodedParams.set("hl", "ja-jp");
   else if (language === "es") encodedParams.set("hl", "es-es");
   else if (language === "fr") encodedParams.set("hl", "fr-fr");
   else encodedParams.set("hl", "hi-in");

   console.log("first")
   const { data }: { data: string } = await axios.post(
     "https://voicerss-text-to-speech.p.rapidapi.com/",
     encodedParams,
     {
       params: {key : VITE_TEXT_TO_SPEECH_API_KEY},
       headers: {
         "content-type": "application/x-www-form-urlencoded",
         "X-RapidAPI-Key": VITE_RAPID_KEY,
         "X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
       },
     }
   );


  console.log("second")
   console.log("herer",data)

   return data;
}