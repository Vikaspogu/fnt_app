package main

import (
	"fmt"
	"go_backend/handlers"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set the router as the default one shipped with Gin
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"},
		AllowHeaders:     []string{"Origin", "content-type", "accept", "authorization", "Platform"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Setup route group for the router
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	//Tech events CRUD endpoints
	router.GET("/alltechtalks", VerifyToken(), handlers.AllTechTalks)
	router.POST("/techtalk", VerifyToken(), handlers.CreateTechTalk)
	router.PUT("/updatetechtalk", VerifyToken(), handlers.UpdateTechTalk)
	router.DELETE("/techtalk/:id", VerifyToken(), handlers.DeleteTechTalk)

	//Social event CRUD endpoints
	router.GET("/allsocialevents", VerifyToken(), handlers.AllSocialEvents)
	router.POST("/socialevent", VerifyToken(), handlers.CreateSocialEvent)
	router.PUT("/updatesocialevent", VerifyToken(), handlers.UpdateSocialEvent)
	router.DELETE("/socialevent/:id", VerifyToken(), handlers.DeleteSocialEvent)

	//request social event CRUD endpoints
	router.GET("/allrequestedsocial", VerifyToken(), handlers.AllRequestedSocial)
	router.POST("/requestedsocial", VerifyToken(), handlers.CreateRequestedSocial)
	router.PUT("/updaterequestedsocial", VerifyToken(), handlers.UpdateRequestedSocial)
	router.DELETE("/requestedsocial/:id", VerifyToken(), handlers.DeleteRequestedSocial)

	//request tech talk CRUD endpoints
	router.GET("/allrequestedtalk", VerifyToken(), handlers.AllRequestedTalk)
	router.POST("/requestedtalk", VerifyToken(), handlers.CreateRequestedTalk)
	router.PUT("/updaterequestedtalk", VerifyToken(), handlers.UpdateRequestedTalk)
	router.DELETE("/requestedtalk/:id", VerifyToken(), handlers.DeleteRequestedTalk)

	//update Scrape Image
	router.PUT("/updatetechimg", VerifyToken(), handlers.UpdateImageTechTalk)
	router.PUT("/updatesocialimg", VerifyToken(), handlers.UpdateImageSocial)
	router.PUT("/updatereqsocialimg", VerifyToken(), handlers.UpdateImageReqSocial)
	router.PUT("/updatereqtalkimg", VerifyToken(), handlers.UpdateImageReqTalk)

	//promote events to Upcoming schedule
	router.PUT("/promotesocialrequest", VerifyToken(), handlers.PromoteSocialRequest)
	router.PUT("/promoterequesttalk", VerifyToken(), handlers.PromoteRequestedTalk)

	//vote for the events
	router.POST("/votesocial", VerifyToken(), handlers.UpdateSocialVotes)

	//request social event CRUD endpoints
	router.GET("/allreportedissues", VerifyToken(), handlers.AllReportedIssue)
	router.POST("/reportedissue", VerifyToken(), handlers.CreateReportedIssue)
	router.PUT("/updatereportedissue", VerifyToken(), handlers.UpdateReportedIssue)
	router.PUT("/updatefixedissue", VerifyToken(), handlers.UpdateFixedIssue)
	router.DELETE("/reportedissue/:id", VerifyToken(), handlers.DeleteReportedIssue)

	// Start and run the server
	_ = router.Run(":8080")
}

//VerifyToken jwt
func VerifyToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		if "web" == c.GetHeader("Platform") {
			VerifyWebToken(c)
		}
	}
}

//VerifyWebToken for web component
func VerifyWebToken(c *gin.Context) {
	SecretKey := "-----BEGIN CERTIFICATE-----\n" + "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArZf+koTiIh8CDmvMgfhw2FFu/gU+cSmi32QBNL8r5RI3hcEy2TagOVcx8QuwCahnyXsVb7ii+9iyRNDZxyPqqA+CLrq808uHOiDhFZJ6Si7O00zqxNc5VjHvhl0y0uGMwspPQHl3cl17Tglm+wPRsHY9LpIv0oaTlXHZTqwTdF+CT4VHiimSVlyJyAb96w3YcgFoSTuPX04UzpU+C3zTrSAuLQimiwlpt0bz8K+xw/GlBCt+zmeADgCyl/Vs4Mo2YsSRye5z4u/NaKrTDyYIGNjZp6V1CP+BpVs/h0PXU6emgIs75dZj2C9xPXFZdy3QjtE9KpvcJ8jq1iUWUT/e+wIDAQAB" + "\n-----END CERTIFICATE-----"

	reqToken := c.GetHeader("Authorization")

	key, er := jwt.ParseRSAPublicKeyFromPEM([]byte(SecretKey))
	if er != nil {
		fmt.Println(er)
		c.Abort()
		c.Writer.WriteHeader(http.StatusUnauthorized)
		_, _ = c.Writer.Write([]byte("Unauthorized"))
		return
	}

	_, err := jwt.Parse(reqToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return key, nil
	})

	if err != nil {
		fmt.Println(err)
		c.Abort()
		c.Writer.WriteHeader(http.StatusUnauthorized)
		_, _ = c.Writer.Write([]byte("Unauthorized"))
		return
	}
}
