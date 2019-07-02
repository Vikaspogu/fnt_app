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
	Date           string             `json:"date"`
	AdditionalInfo string             `json:"additionalInfo"`
	MobileNotify   bool               `json:"mobileNotify"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}

//SocialEvent model
type SocialEvent struct {
	ID             primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Place          string             `json:"place"`
	Location       string             `json:"location"`
	Date           string             `json:"date"`
	AdditionalInfo string             `json:"additionalInfo"`
	MobileNotify   bool               `json:"mobileNotify"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at,omitempty"`
}
