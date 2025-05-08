package com.example.bankSystem.controller;
import com.example.bankSystem.model.AbroadLoanRequest;
import com.example.bankSystem.model.LoanStatusDTO;
import com.example.bankSystem.model.PGLoanRequest;
import com.example.bankSystem.model.UGLoanApplicationRequest;
import com.example.bankSystem.repository.UserRepo;
import com.example.bankSystem.service.MailSender;
import com.example.bankSystem.service.OtpGen;
import com.example.bankSystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@CrossOrigin(origins = "*")
public class LoanController
{
    @Autowired
    private UserService service;
    @Autowired
    UserRepo repo;
    @Autowired
    private OtpGen otpGen;
    @Autowired
    private MailSender mailSender;

    @PostMapping("/api/loan/ug")
    public ResponseEntity<Map<String, String>> submitUGLoan(
            @RequestPart("data") UGLoanApplicationRequest dto,
            @RequestPart("collateralDocuments") MultipartFile[] collateralDocuments) throws SQLException {
        service.processUGLoan(dto,collateralDocuments);
        Map<String, String> response = new HashMap<>();
        response.put("message", "UG Loan Application received successfully!");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/api/loan/pg")
    public ResponseEntity<Map<String, String>> submitPgLoan(@RequestPart("data") PGLoanRequest pgLoanDTO, @RequestPart("collateralDocuments") List<MultipartFile> collateralDocuments) throws Exception
    {
        Map<String, String> response = new HashMap<>();
            boolean flag = service.processPgLoan(pgLoanDTO,"789", collateralDocuments.toString());
            if(flag)
            {
                response.put("message", "PG loan application submitted successfully.");
                return ResponseEntity.ok(response);
            }
            response.put("message", "Failed to submit abroad loan application.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }


    @PostMapping("/api/loan/abroad")
    public ResponseEntity<Map<String, String>> submitAbroadLoan(
            @RequestPart("data") AbroadLoanRequest abroadLoanDTO,
            @RequestPart("collateralDocuments") List<MultipartFile> collateralDocuments) throws SQLException {

        Map<String, String> response = new HashMap<>();

        boolean flag = service.saveLoanApplicationAbroad(abroadLoanDTO);

            if(flag)
            {
                response.put("message", "Abroad loan application submitted successfully.");
                return ResponseEntity.ok(response);
            }
            response.put("message", "Failed to submit abroad loan application.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }



    @GetMapping("api/loan/check-applied/{type}/{userId}")
    public ResponseEntity<Map<String, Boolean>> checkLoanApplication(
            @PathVariable String type,
            @PathVariable String userId)
    {

        boolean alreadyApplied = false;
        Map<String, Boolean> response = new HashMap<>();

        response.put("alreadyApplied", alreadyApplied);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/loan-status")
    public List<LoanStatusDTO> getLoanStatus(@RequestParam String userId) {
        System.out.println("Frinerned.........................."+userId);
        return service.getLoanStatus(userId);
    }
}
