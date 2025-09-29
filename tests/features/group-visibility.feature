Feature: Viewing group lock controls
  In order to understand lock permissions
  A group should display the lock switch when it can be managed

  Scenario: Viewing lock controls for a group
    Given I am viewing the group details for group "group-123"
    Then the lock switch should "be" visible
