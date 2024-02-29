import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveResult } from "../redux/slices";

const Quiz = () => {
  const [result, setResult] = useState<string[]>([])

  const [count , setCount] = useState<number>(0)

  const [answer , setAnswer] = useState<string>("")
  
  const { words } = useSelector((state: { root: StateType }) => state.root);
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(()=>{
    
    if(count > words.length-1)  navigate("/result")

    dispatch(saveResult(result))
  },[result])

  const nextHandler= ():void=>{
    setResult(prev=>([...prev,answer]))
    
    setAnswer("");

    setCount((prev) => prev + 1);

  }
  console.log(answer)
  return (
    <Container
      maxWidth="sm"
      sx={{
        padding: "1rem",
      }}
    >
      <Typography m={"2rem 0"}>Quiz</Typography>

      <Typography variant="h3">
        {count + 1} - {words[count]?.word}
      </Typography>
      <FormControl>
        <FormLabel sx={{ mt: "2rem", mb: "1rem" }}>Meaning</FormLabel>
        <RadioGroup value={answer} onChange={(e) => setAnswer(e.target.value)}>
          {words[count]?.options.map((i:string) => (
            <FormControlLabel
              value={i}
              control={<Radio />}
              label={i}
              key={i}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Button
        sx={{
          margin: "3rem 0",
        }}
        variant="contained"
        fullWidth
        onClick={nextHandler}
        disabled={!answer}
      >
        {
          count===words.length-1 ? "Submit" : "Next"
        }
      </Button>
    </Container>
  );
};

export default Quiz;
