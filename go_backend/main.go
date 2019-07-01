package main

import (
	"encoding/json"
	"fmt"
	"go_backend/dao"
	"go_backend/models"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var techTalk []models.TechTalk

func main() {
	r := mux.NewRouter()
	r.Use(loggingMiddleware)
	r.HandleFunc("/alltechtalks", AllTechTalks).Methods("GET")
	r.HandleFunc("/techtalk", CreateTechTalk).Methods("POST")
	r.HandleFunc("/techtalk/{id}", UpdateTechTalk).Methods("PUT")
	r.HandleFunc("/techtalk", DeleteTechTalk).Methods("DELETE")
	r.HandleFunc("/techtalk/{id}", FindTechTalk).Methods("GET")
	fmt.Println("Starting server on port 8080...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println(r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

//AllTechTalks endpoint
func AllTechTalks(w http.ResponseWriter, r *http.Request) {
	payload := dao.GetAlltechtalk()
	json.NewEncoder(w).Encode(payload)
}

//CreateTechTalk endpoint
func CreateTechTalk(w http.ResponseWriter, r *http.Request) {
	var techTalk models.TechTalk
	_ = json.NewDecoder(r.Body).Decode(&techTalk)
	dao.InsertOneValue(techTalk)
	json.NewEncoder(w).Encode(techTalk)

}

//UpdateTechTalk endpoint
func UpdateTechTalk(w http.ResponseWriter, r *http.Request) {
	techtalkID := mux.Vars(r)["id"]
	var techtalk models.TechTalk
	_ = json.NewDecoder(r.Body).Decode(&techtalk)
	dao.UpdateTechTalk(techtalk, techtalkID)
}

//FindTechTalk endpoint
func FindTechTalk(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}

//DeleteTechTalk endpoint
func DeleteTechTalk(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "not implemented yet !")
}
