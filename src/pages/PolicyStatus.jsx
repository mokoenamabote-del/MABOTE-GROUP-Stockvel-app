  const updatePolicyStatus = (
    applicationNumber,
    newPolicyStatus
  ) => {
    const member = applications.find(
      (application) =>
        application.applicationNumber ===
        applicationNumber
    );

    if (!member) {
      return;
    }

    updateApplication(
      applicationNumber,
      {
        policyStatus: newPolicyStatus,
      }
    );

    /*
     * Keep the approved member record
     * synchronized with the application.
     */
    try {
      const savedMembers = JSON.parse(
        localStorage.getItem("maboteMembers") || "[]"
      );

      if (Array.isArray(savedMembers)) {
        const updatedMembers = savedMembers.map(
          (savedMember) =>
            savedMember.applicationNumber ===
            applicationNumber
              ? {
                  ...savedMember,
                  policyStatus:
                    newPolicyStatus,
                }
              : savedMember
        );

        localStorage.setItem(
          "maboteMembers",
          JSON.stringify(updatedMembers)
        );
      }
    } catch (error) {
      console.error(
        "Unable to update member policy:",
        error
      );
    }

    const fullName =
      `${member.fullName || ""} ${
        member.surname || ""
      }`.trim();

    if (newPolicyStatus === "Active") {
      setResponseMessage(
        `Dear ${
          fullName || "Member"
        }, your MABOTE GROUP PTY(LTD) policy ${
          member.policyNumber || ""
        } is now marked as ACTIVE.`
      );
    }

    if (newPolicyStatus === "Lapsed") {
      setResponseMessage(
        `Dear ${
          fullName || "Member"
        }, your MABOTE GROUP PTY(LTD) policy ${
          member.policyNumber || ""
        } has been marked as LAPSED. Please contact MABOTE GROUP PTY(LTD) regarding your policy status.`
      );
    }
  };