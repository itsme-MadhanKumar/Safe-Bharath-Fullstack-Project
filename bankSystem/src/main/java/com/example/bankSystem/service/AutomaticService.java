package com.example.bankSystem.service;


import com.example.bankSystem.repository.LoanRepo;
import com.example.bankSystem.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AutomaticService
{
    @Autowired
    UserRepo repo;

    @Autowired
    LoanRepo loanRepo;

    @Autowired
    UserService userService;


//    ---------------------------------------Auto Approval of New users
    @Scheduled(fixedRate = 120000)
    public void AutoApprovalControllerofNewUser()
    {
        System.out.println("Auto Approval Starting...");
        repo.AutoApprovalRepo();
        //- Welcome message
    }

//    -----------------------------------Loan Auto Approval
    @Scheduled(fixedRate = 12000)
    public void AutoApproalofLoan()
    {
        System.out.println("Loan Approval Starting");
        List<String> pendingLoanIds = userService.gettingPendingLoanIdService();
        for (String a : pendingLoanIds) {
            System.out.println(a);
        }

    }

}
