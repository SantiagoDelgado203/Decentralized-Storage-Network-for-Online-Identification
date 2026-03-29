package core

import (
	"fmt"
	"strconv"
	"time"
)

/*---------------------------BASE DEFINITIONS-----------------------------*/

type Verifier interface{}

/*Verification Agent*/

type VerificationAgent struct{}

func (v *VerificationAgent) VerifyName(name string, rule map[string]any) bool {
	switch rule["Operation"] {
	case "equals":
		return name == rule["Value"]
	default:
		return false
	}
}
func (v *VerificationAgent) VerifyAge(age int, rule map[string]any) bool {

	rule_age, err := strconv.Atoi(rule["Value"].(string))
	if err != nil {
		fmt.Println("Error: Couldn't convert age to int")
	}
	switch rule["Operation"] {
	case "minimum":
		return age >= rule_age
	case "maximum":
		return age <= rule_age
	case "equals":
		return age == rule_age
	default:
		return false
	}
}

func (v *VerificationAgent) VerifyAddress(address string, rule map[string]any) bool {
	switch rule["Operation"] {
	case "equals":
		return address == rule["Value"]
	default:
		return false
	}
}

func (v *VerificationAgent) VerifyGender(gender string, rule map[string]any) bool {
	switch rule["Operation"] {
	case "equals":
		return gender == rule["Value"]
	default:
		return false
	}
}

func (v *VerificationAgent) ResolveAND(data map[string]any, AND []map[string]any) bool {

	for _, item := range AND {
		if item["Type"] != "Rule" {
			if !v.Verify(data, item) {
				return false
			}
		} else {
			if !v.VerifyRule(data, item) {
				return false
			}
		}
	}

	return true

}

func (v *VerificationAgent) ResolveOR(data map[string]any, OR []map[string]any) bool {

	for _, item := range OR {
		if item["Type"] != "Rule" {
			if v.Verify(data, item) {
				return true
			}
		} else {
			if v.VerifyRule(data, item) {
				return true
			}
		}
	}

	return false
}

func (v *VerificationAgent) ResolveNOT(data map[string]any, NOT map[string]any) bool {
	return !v.Verify(data, NOT)
}

func (v *VerificationAgent) Verify(data map[string]any, criteria map[string]any) bool {

	switch criteria["Type"] {
	case "AND":
		raw := criteria["Criteria"].([]any)

		var parsed []map[string]any
		for _, item := range raw {
			parsed = append(parsed, item.(map[string]any))
		}

		if !v.ResolveAND(data, parsed) {
			return false
		}

	case "OR":
		raw := criteria["Criteria"].([]any)

		var parsed []map[string]any
		for _, item := range raw {
			parsed = append(parsed, item.(map[string]any))
		}

		if !v.ResolveOR(data, parsed) {
			return false
		}

	case "NOT":
		if !v.ResolveNOT(data, criteria["Criteria"].(map[string]any)) {
			return false
		}

	case "Rule":
		if !v.VerifyRule(data, criteria) {
			fmt.Println("\nFailed rule: ", criteria)
			fmt.Println("\nData: ", data)
			return false
		}

	default:
		return false
	}

	return true
}

func (v *VerificationAgent) VerifyRule(data map[string]any, rule map[string]any) bool {
	fmt.Println("\n", rule)
	switch rule["Field"] {
	case "Name":
		return v.VerifyName(data["Name"].(string), rule)
	case "Age":
		DOB := data["DOB"].(map[string]any)

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
