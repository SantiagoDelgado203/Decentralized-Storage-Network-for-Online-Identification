package core

func VerifyRule(data map[string]any, rule Rule) bool {
	switch rule.Type {
	case "equal":
		{
			return data[rule.Field] == rule.Value
		}
	default:
		return false
	}
}

func VerifyCriteria(data map[string]any, criteria Criteria) bool {

	for _, rule := range criteria.All {
		if !VerifyRule(data, rule) {
			return false
		}
	}

	return true
}
