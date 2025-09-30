Feature: Toggle the group lock switch
  In order to control access to sensitive groups
  A group administrator should be able to flip the lock switch between checked and unchecked states

  Scenario: Toggle the lock switch on and off
    Given I am viewing the group details for group "group-123"
    Then I should see the group lock switch
    And the lock switch should be "unchecked"
    When I set the lock switch to "checked"
    Then the lock switch should be "checked"
    When I set the lock switch to "unchecked"
    Then the lock switch should be "unchecked"
