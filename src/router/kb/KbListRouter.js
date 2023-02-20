import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Pagination,
  Typography,
} from "@mui/material";
import "./KbListRouter.css";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";

const columns = [
  { field: "id", headerName: "ID", flex: 0.3 },
  { field: "hqCd", headerName: "본부 코드", flex: 1 },
  { field: "hqNm", headerName: "본부 명", flex: 1 },
  { field: "agncCd", headerName: "지점 코드", flex: 1 },
  { field: "agncNm", headerName: "지점 명", flex: 1 },
  { field: "gaCd", headerName: "GA 코드", flex: 1 },
  { field: "gaNm", headerName: "GA 명", flex: 1 },
  { field: "brnCd", headerName: "지사 코드", flex: 1 },
  { field: "brnNm", headerName: "지사 명", flex: 1 },
];

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function Kb() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const sse = new EventSource("https://146.56.38.5:8082/progress");
    function getRealtimeData(data) {
      setProgress((data.data / data.all) * 100);
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      sse.close();
    };
    axios
      .get(`https://146.56.38.5:8082/status`)
      .then((response) => response.data)
      .then((data) => {
        setStatus(data);
      })
      .catch(function (error) {
        alert(error);
      })
      .finally(function () {
        setLoading(false);
      });

    return () => {
      sse.close();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://146.56.38.5:8082/orgMapping?page=${page}`)
      .then((response) => response.data)
      .then((data) => {
        setTotalPages(data.totalPages);
        setRows(data.content);
      })
      .catch(function (error) {
        alert(error);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [page]);

  return (
    <React.Fragment>
      <div
        style={{
          display: loading ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          opacity: "70%",
          width: "100%",
          position: "fixed",
          height: "100%",
          zIndex: 50,
        }}
      >
        <CircularProgress size={200} />
      </div>
      <div
        className="wrap"
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            메인
          </Button>
          <Box
            sx={{
              width: "100%",
              maxWidth: 1000,
              display: status ? "block" : "none",
            }}
          >
            <LinearProgressWithLabel value={progress} />
          </Box>
          <div>
            <Button
              variant="contained"
              onClick={() => {
                setLoading(true);
                axios({
                  method: "get",
                  url: "https://146.56.38.5:8082/orgMapping/excel",
                  responseType: "blob",
                }).then((response) => {
                  const url = window.URL.createObjectURL(
                    new Blob([response.data], {
                      type: response.headers["content-type"],
                    })
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "조직구조.xlsx");
                  document.body.appendChild(link);
                  link.click();
                  setLoading(false);
                });
              }}
            >
              엑셀 다운로드
            </Button>
            <Button variant="contained" component="label">
              엑셀 업로드
              <input
                onChange={(event) => {
                  const form = new FormData();
                  form.append("file", event.target.files[0]);
                  setLoading(true);
                  axios
                    .post(`https://146.56.38.5:8082/orgMapping`, form)
                    .then((response) => {
                      alert(response.data);
                      setLoading(false);
                      setStatus(true);
                    })
                    .catch((error) => {
                      error.request.readyState === 4
                        ? alert("하루에 한번만 호출 가능")
                        : console.log("업로드 실패", error.request);
                      setLoading(false);
                    });
                }}
                hidden
                type="file"
              />
            </Button>
          </div>
        </div>
        <DataGrid
          autoHeight
          paginationMode={"server"}
          rows={rows}
          columns={columns}
          pageSize={10}
          pagination={true}
          components={{
            Footer: () => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid rgba(224, 224, 224, 1)",
                  borderRadius: "4px",
                }}
              >
                <Pagination
                  page={page + 1}
                  count={totalPages}
                  onChange={(event, value) => {
                    setPage(value - 1);
                  }}
                />
              </div>
            ),
          }}
        />
      </div>
    </React.Fragment>
  );
}

export default Kb;
