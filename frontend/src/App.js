import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItemText,
  IconButton,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const API_URL = "http://localhost:8000/api/devices/";

function App() {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState("");

  const fetchDevices = () => {
    axios.get(API_URL).then((response) => {
      setDevices(response.data.sort((a, b) => a.id - b.id));
    });
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const addDevice = () => {
    if (newDevice.trim() === "") return;
    axios
      .post(API_URL, { name: newDevice, status: false })
      .then(() => {
        setNewDevice("");
        fetchDevices();
      });
  };

  const deleteDevice = (id) => {
    axios.delete(`${API_URL}${id}`).then(() => fetchDevices());
  };

  const toggleDeviceStatus = (id) => {
    axios.patch(`${API_URL}${id}/toggle`).then((response) => {
      const updatedDevice = response.data;
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === updatedDevice.id ? updatedDevice : device
        )
      );
    });
  };

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Управление устройствами
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Название устройства"
            value={newDevice}
            onChange={(e) => setNewDevice(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addDevice}
            style={{ marginTop: "10px" }}
          >
            Добавить устройство
          </Button>
        </Grid>
      </Grid>

      <List style={{ marginTop: "20px" }}>
        {devices.map((device) => (
          <Card
            key={device.id}
            style={{
              marginBottom: "10px",
              minHeight: "80px",
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <CardContent style={{ flex: 1 }}>
              <ListItemText
                primary={device.name}
                secondary={
                  device.status ? "Статус: Включено" : "Статус: Выключено"
                }
              />
            </CardContent>
            <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
              <IconButton
                onClick={() => toggleDeviceStatus(device.id)}
                style={{
                  backgroundColor: device.status ? "green" : "gray",
                  color: "white",
                }}
              >
                <PowerSettingsNewIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => deleteDevice(device.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </Card>
        ))}
      </List>
    </Container>
  );
}

export default App;
