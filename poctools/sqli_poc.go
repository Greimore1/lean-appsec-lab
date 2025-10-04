package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
)

type loginResp struct { Token string `json:"token"` }

func main() {
	target := flag.String("target", "http://localhost:3001", "Base URL of target app")
	flag.Parse()

	payload := map[string]string{
		"username": "alice' OR '1'='1",
		"password": "anything",
	}
	b, _ := json.Marshal(payload)

	resp, err := http.Post(*target+"/login", "application/json", bytes.NewReader(b))
	if err != nil { fail("request error: ", err) }
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode == 200 && bytes.Contains(body, []byte("token")) {
		fmt.Println("[VULN] SQLi bypass appears successful (token returned)")
		os.Exit(0)
	}
	fmt.Println("[SAFE] SQLi bypass failed (likely remediated)")
	os.Exit(1)
}

func fail(msg string, err error) { fmt.Println("error:", msg, err); os.Exit(2) }
