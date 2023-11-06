import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Title from "./components/Title";
import ImgButton from "./components/ButtonImg";

function App() {
  const [refimage, setRefImage] = useState<string | null>(null);
  const [oriImage, setOriImage] = useState<[string] | null>(null);
  const dataSetImage: string[] = [];

  // Callback function to update refimage
  const handleRefImageChange = (newImage: string | null) => {
    setRefImage(newImage);
  };

  const handleDataSetChange = async (e: ChangeEvent<HTMLInputElement>) => {
    dataSetImage.length = 0;
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target && typeof event.target.result === "string") {
            dataSetImage.push(event.target.result);
          }

          // Check if all files have been processed
          if (dataSetImage.length === selectedFiles.length) {
            console.log(dataSetImage.length);
            console.log(dataSetImage);
            //sendPostRequest
            await sendPostRequest();
          }
        };

        reader.readAsDataURL(selectedFiles[i]);
      }
      console.log(dataSetImage.length);
    }
  };

  const sendPostRequest = async () => {
    try {
      const response = await fetch("http://localhost:5000/process_array", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          set: dataSetImage,
        }),
      });

      if (response.ok) {
        const responseBody = await response.json(); // Parse the response body as JSON
        console.log("POST request successful");
        console.log("Response Body:", responseBody); // Print the response body
      } else {
        console.error("POST request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <Title />
      <hr />
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleDataSetChange}
      />
      <hr />
      <ImgButton onImageChange={handleRefImageChange} />
      <button onClick={sendPostRequest}> Send Reference Image </button>
    </div>
  );
}

export default App;
