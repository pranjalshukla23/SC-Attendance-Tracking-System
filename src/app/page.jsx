"use client";

import * as XLSX from "xlsx";
import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Image from "next/image";
const trainers = [
  "Ali",
  "Nuran",
  "Vasilios",
  "Steven Jose",
  "Joerg Riehm",
  "Denise-Sophie",
  "Paul Kummetz",
  "Helge",
  "Hasret Urge",
  "Christian Bleichner",
  "Oubey Jelloul",
  "Oliver Dröse",
  "Aaron Boateng",
  "Dominik Bauer",
  "Pa Tumani Tamba",
  "Klaus Kroner",
  "Daniel Hammel",
  "Mustafa Can",
  "Osama Al Hattami",
  "Harika Ganguru",
  "Hedayatullah Salehzoi",
  "Stuart Wills",
  "Olumuyiwa Adetunji (Peter)",
  "Abdelmalek Gaceb",
  "Gangas Mirah",
  "Chris Judge",
  "Usman Moghal",
  "Hollie Travill",
  "Merry Khalifa",
  "Jordan Rock",
  "Clare Nayler",
  "Abby Shaw",
  "Richard O-connell",
];
const countries = ["DE", "NL", "UK", "ES", "AT"];
const hours = ["1", "2", "3", "4", "5", "6", "7", "8"];
export default function Home() {
  const toast = useToast();
  const [trainerName, setTrainerName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isDay1Training, setIsDay1Training] = useState(false);
  const [isDay2Training, setIsDay2Training] = useState(false);
  const [day1Hours, setDay1Hours] = useState(0);
  const [day2Hours, setDay2Hours] = useState(0);
  const [weekNumber, setWeekNumber] = useState(0);
  const [trainersTrackingList, setTrainersTrackingList] = useState([]);

  const loadExistingFile = async () => {
    const response = await fetch("/2024_SM_Trainer_Tracker-Mock-Sheet.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setTrainersTrackingList(jsonData);
    console.log("read all records")
  };
  function getWeekNumbers() {
    const weekNumbers = [];
    const startDate = new Date("2024-01-01");
    const currentDate = new Date();

    let startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Adjust to the start of the week (Monday)

    while (startOfWeek <= currentDate) {
      const weekNumber = getWeekNumber(startOfWeek);
      weekNumbers.push(weekNumber);
      startOfWeek.setDate(startOfWeek.getDate() + 7); // Move to the next week
    }

    return weekNumbers;
  }

  function getWeekNumber(date) {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstJan.getDay() + 1) / 7);
  }

  const handleDay1Change = (event) => {
    setIsDay1Training(event.target.checked);
  };

  const handleDay2Change = (event) => {
    setIsDay2Training(event.target.checked);
  };

  function submitHandler() {
    if (!trainerName || !country || !weekNumber || !city) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const record = {
        Trainer_Name: trainerName,
        Country: country,
        City: city,
        Day1: isDay1Training === true ? "Present" : "Absent",
        Day2: isDay2Training === true ? "Present" : "Absent",
        Day1_Hours: day1Hours,
        Day2_Hours: day2Hours,
        Total_Hours: day1Hours + day2Hours,
        Week_Number: weekNumber,
        Feedback: feedback,
      };
      const newDataArr = [...trainersTrackingList, record];
      setTrainersTrackingList(newDataArr);
      toast({
        title: "Record added successfully",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  function handleExport() {
    console.log("trainers tracking list", trainersTrackingList);
    // Create a workbook
    const wb = XLSX.utils.book_new();

    // Convert array of dictionaries to worksheet
    const ws = XLSX.utils.json_to_sheet(trainersTrackingList);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Trainer_Attendance");

    // Export the workbook to an Excel file and trigger download
    XLSX.writeFile(wb, "SM_Trainer_Tracker.xlsx");
  }

  useEffect(() => {
    loadExistingFile();
  }, []);
  return (
    <Box
      pos={"relative"}
      w="full"
      h="100vh"
      display="flex"
      flexDir="column"
      alignItems="center"
    >
      <Box
        w="full"
        height="5rem"
        p={2}
        mb={20}
        border="1px solid gray"
        background="#fcfcfc"
      >
        <Image src={"/logo.png"} alt="logo" width={50} height={50}></Image>
      </Box>
      <Text textDecor="underline" fontWeight="bold" fontSize={30} mb={4}>
        Trainer Attendance System
      </Text>
      <Card w="50%" boxShadow={"2xl"}>
        <CardBody>
          <Box display="flex" gap={4} alignItems={"center"} my={2}>
            <Text w="20%" fontWeight="bold">
              Trainer Name
            </Text>
            <Select
              w="80%"
              placeholder="select driver name..."
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
              isRequired
            >
              {trainers.map((trainer) => (
                <option
                  value={trainer}
                  key={trainer}
                  onChange={(e) => setTrainerName(e.target.value)}
                >
                  {trainer}
                </option>
              ))}
            </Select>
          </Box>
          <Box display="flex" gap={4} alignItems={"center"} my={2}>
            <Text w="20%" fontWeight="bold">
              Country
            </Text>
            <Select
              w="80%"
              placeholder="select country..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              isRequired
            >
              {countries.map((country) => (
                <option value={country} key={country}>
                  {country}
                </option>
              ))}
            </Select>
          </Box>
          <Box display="flex" gap={4} alignItems={"center"} my={2}>
            <Text w="20%" fontWeight="bold">
              City
            </Text>
            <Input
              w="80%"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            ></Input>
          </Box>
          <Box display="flex" gap={4} alignItems={"center"} my={2}>
            <Text w="20%" fontWeight="bold">
              {" "}
              Training Day{" "}
            </Text>
            <Stack spacing={5} direction="row">
              <label>
                <input
                  style={{
                    marginRight: "2px",
                  }}
                  type="checkbox"
                  name="checkbox1"
                  checked={isDay1Training}
                  onChange={handleDay1Change}
                />
                Day 1
              </label>
              <label>
                <input
                  style={{
                    marginRight: "2px",
                  }}
                  type="checkbox"
                  name="checkbox2"
                  checked={isDay2Training}
                  onChange={handleDay2Change}
                />
                Day 2
              </label>
            </Stack>
          </Box>
          {isDay1Training && (
            <Box display="flex" gap={4} alignItems={"center"} my={2}>
              <Text w="20%" fontWeight="bold">
                Day 1 Hours
              </Text>
              <Select
                w="80%"
                placeholder="select training hours..."
                value={day1Hours}
                onChange={(e) => setDay1Hours(e.target.value)}
                defaultValue={0}
              >
                {hours.map((hour) => (
                  <option value={hour} key={hour}>
                    {hour}
                  </option>
                ))}
              </Select>
            </Box>
          )}
          {isDay2Training && (
            <Box display="flex" gap={4} alignItems={"center"} my={2}>
              <Text w="20%" fontWeight="bold">
                Day 2 Hours
              </Text>
              <Select
                w="80%"
                placeholder="select training hours..."
                value={day2Hours}
                onChange={(e) => setDay2Hours(e.target.value)}
                defaultValue={0}
              >
                {hours.map((hour) => (
                  <option value={hour} key={hour}>
                    {hour}
                  </option>
                ))}
              </Select>
            </Box>
          )}

          {(day1Hours !== 0 || day2Hours !== 0) && (
            <Box display="flex" gap={4} alignItems={"center"} my={2}>
              <Text w="20%" fontWeight="bold">
                Total Hours
              </Text>
              <Input
                w="80%"
                isDisabled
                value={parseInt(day1Hours) + parseInt(day2Hours)}
              ></Input>
            </Box>
          )}

          <Box display="flex" gap={4} alignItems={"center"} my={2}>
            <Text w="20%" fontWeight="bold">
              Week number
            </Text>
            <Select
              w="80%"
              placeholder="select week number..."
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              isRequired
            >
              {getWeekNumbers().map((weekNumber) => (
                <option value={weekNumber} key={weekNumber}>
                  {weekNumber}
                </option>
              ))}
            </Select>
          </Box>
          <Box display="flex" gap={4} alignItems={"center"} my={2}>
            <Text w="20%" fontWeight="bold">
              Feedback
            </Text>
            <Textarea
              placeholder="Enter Trainer Feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </Box>
          <Box display="flex" justifyContent="center">
            <Button type="submit" colorScheme="red" onClick={submitHandler}>
              Submit
            </Button>
          </Box>
        </CardBody>
      </Card>

      <Button
        pos="absolute"
        right={4}
        bottom={4}
        background="blue"
        color="white"
        onClick={() => handleExport(trainersTrackingList)}
      >
        Export To Excel
      </Button>
    </Box>
  );
}
