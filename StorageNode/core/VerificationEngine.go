package core

import (
	"time"
)

/*---------------------------BASE DEFINITIONS-----------------------------*/

type Verifier interface {
	VerifyName(name string, rule Rule) bool
	VerifyAge() bool
	VerifyAddress() bool
	VerifyGender() bool
	//A custom verifier for each field

	//General and individual
	Verify(data map[string]any, criteria Criteria) bool
	VerifyRule(data map[string]any, rule Rule) bool
}

type VerificationEngine struct {
	Verifier Verifier
	Criteria Criteria
	Data     map[string]any
}

/*-------------------------------------------------------------------------*/

/*Verification Agent*/

type VerificationAgent struct{}

func (v *VerificationAgent) VerifyName(name string, rule Rule) bool {
	switch rule.Type {
	case "equals":
		return name == rule.Value
	default:
		return false
	}
}
func (v *VerificationAgent) VerifyAge(age int, rule Rule) bool {
	rule_age := int(rule.Value.(float64))
	switch rule.Type {
	case "minimum":
		return age >= rule_age
	case "equals":
		return age == rule_age
	default:
		return false
	}
}

func (v *VerificationAgent) VerifyAddress(address string, rule Rule) bool {
	switch rule.Type {
	case "equals":
		return address == rule.Value
	default:
		return false
	}
}

func (v *VerificationAgent) VerifyGender(gender string, rule Rule) bool {
	switch rule.Type {
	case "equals":
		return gender == rule.Value
	default:
		return false
	}
}

func (v *VerificationAgent) Verify(data map[string]any, criteria Criteria) bool {
	for _, rule := range criteria.All {
		if !v.VerifyRule(data, rule) {
			return false
		}
	}
	return true
}

func (v *VerificationAgent) VerifyRule(data map[string]any, rule Rule) bool {
	switch rule.Field {
	case "Name":
		return v.VerifyName(data["Name"].(string), rule)
	case "Age":
		DOB := data["DOB"].(map[string]any)
		// year, _ := strconv.Atoi(DOB["year"].(string))
		// month, _ := strconv.Atoi(DOB["month"].(string))
		// day, _ := strconv.Atoi(DOB["day"].(string))

		birthDate := time.Date(
			int(DOB["year"].(float64)),
			time.Month(int(DOB["month"].(float64))),
			int(DOB["day"].(float64)),
			0, 0, 0, 0,
			time.UTC)
		now := time.Now()

		age := now.Year() - birthDate.Year()

		// If birthday hasn't happened yet this year, subtract 1
		if now.YearDay() < birthDate.YearDay() {
			age--
		}

		return v.VerifyAge(age, rule)

	case "Address":
		return v.VerifyAddress(data["Address"].(string), rule)
	case "Gender":
		return v.VerifyGender(data["Gender"].(string), rule)
	default:
		return false
	}
}
