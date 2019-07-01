package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

//TechTalk model
type TechTalk struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Topic          string             `json:"topic"`
	Presenter      string             `json:"presenter"`
	Location       string             `json:"location"`
	Date           time.Time          `bson:"date" json:"date,omitempty"`
	AdditionalInfo string             `json:"additionalInfo"`
	MobileNotify   bool               `json:"mobileNotify"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updated_at,omitempty"`
}
