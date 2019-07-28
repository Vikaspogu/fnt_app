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

	// Start and run the server
	router.Run(":8080")
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
	SecretKey := "-----BEGIN CERTIFICATE-----\n" + "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApnaH3tm8PKUMcqHe3IvGtWiXeucv76UqcpQsjEWQuWxOSeo7s3jSVT+ZJR9hsUIEop4Z7wUFqBcU2GHZBoiZvJgG+AJHgysLUP1Ln0S1s/c4tOuv66O/9zRYpkXRTy7ujQd4+iGj2izfJ1Bq5D2FPHSKJCWXYeBR5KP9wRejflnfoiZlKBoaoEfYR5cnWCp9FB8r7vPiAYJnGxOwiiH59O9Qb3gw9JkRNE/dJcGCW7eq1YU/hs5XXvfHLA+P/oq4mF+6gXcu+AZCU75l7x5iaIznYQVU8iVAy3fj9ADIJMBNCvkje7yjo3nPwdAinU77SucP+wnyuCHaCHp8P1yCnwIDAQAB" + "\n-----END CERTIFICATE-----"

	reqToken := c.GetHeader("Authorization")

	key, er := jwt.ParseRSAPublicKeyFromPEM([]byte(SecretKey))
	if er != nil {
		fmt.Println(er)
		c.Abort()
		c.Writer.WriteHeader(http.StatusUnauthorized)
		c.Writer.Write([]byte("Unauthorized"))
		return
	}

	_, err := jwt.Parse(reqToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return key, nil
	})

	if err != nil {
		fmt.Println(err)
		c.Abort()
		c.Writer.WriteHeader(http.StatusUnauthorized)
		c.Writer.Write([]byte("Unauthorized"))
		return
	}
}
