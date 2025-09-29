Feature: Locking a group
  In order to control access to sensitive groups
  A group should support toggling its lock state via the lock switch

  Scenario: Locking a group via the lock switch
    Given I am viewing the group details for group "group-123"
    And the lock switch is "unchecked"
    When I set the lock switch to "checked"
    Then the lock switch should be "checked"

  Scenario: Unlocking a group via the lock switch
    Given I am viewing the group details for group "group-123"
    And the lock switch is "checked"
    When I set the lock switch to "unchecked"
    Then the lock switch should be "unchecked"
