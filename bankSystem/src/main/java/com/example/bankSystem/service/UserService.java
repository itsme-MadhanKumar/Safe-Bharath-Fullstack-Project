package com.example.bankSystem.service;
import com.example.bankSystem.model.*;
import com.example.bankSystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class UserService
{
    @Autowired
    UserRepo repo;

    @Autowired
    UserPaymentRepo userPaymentRepo;

    @Autowired
    LoanRepo loanRepo;

    public boolean updateProfilePicture(String aadhar, InputStream inputStream)
    {
       return repo.updateProfilePicture(aadhar,inputStream);
    }

    public boolean storeAction(String aadhar, String action, MultipartFile image)
    {
        try {
            byte[] boloBytes = image.getBytes();
            String timestamp = new SimpleDateFormat("HH:mm:ss").format(new Date());
            String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

            return repo.insertAction(aadhar, action, timestamp, date, boloBytes);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    public UserDashboardDTO fetchUserDashboard(String userId) {

        return  repo.getUserDashboardData(userId);
    }

    public List<Transaction> getTransactionsByUserId(String userId)
    {
        return repo.getTransactionsByUserId(userId);
    }

    public boolean CheckOldPasswordService(String userId,String password)
    {
        return repo.isCheckingtheOldPassword(userId,password);
    }

    public String fetchingEmailService(String userid)
    {
        return repo.fetchingemailByUserId(userid);
    }

    public void updatingUserPasswordService(String user,String pass)
    {
        repo.updatingUserPassword(user,pass);
    }

    public boolean fetchingOldMobileService(String userId,String oldMobile)
    {
        return repo.isCheckingtheOldMobile(userId,oldMobile);
    }
    public void updatingUserMobileService(String userId,String mobile)
    {
        repo.updatingUserMobile(userId,mobile);
    }

    public void updatingUserEmailService(String userId,String aadhar)
    {
        repo.UpdateEmailAddress(userId,aadhar);
    }

    public void updatingHomeAddressService(String userId,String address)
    {
        repo.UpdateHomeAddressRepo(userId,address);
    }

    public boolean updatingTakeAction(String userid,String action)
    {
        if(action.equals("delete"))
        {
            return repo.DeletingtheUserAccountRepo(userid);
        }
        return repo.UpdatingActionTakenRepo(userid,action);
    }
    public void UpdatingPaymentPasswordService(String user ,String password)
    {
        repo.updatingPaymentPasswordRepo(user,password);
    }



    public boolean isPaymentPasswordGeneratedService(String userId)
    {
        return userPaymentRepo.isUserGeneratedPaymentPasswordRepo(userId);
    }

    public String CurrentBalanceService(String userId)
    {
        return userPaymentRepo.CurrentUserBalanceRepo(userId);
    }

    public String CurrentActualLoanBalanceService(String userId,String App_id)
    {
        return userPaymentRepo.CurrentUserActualBalanceRepo(userId,App_id);
    }

    public boolean UpdatingCurrentBalanceService(String userId,String money)
    {
        return userPaymentRepo.UpdatingCurrentBalanceRepo(userId,money);
    }

    public String generateTransactionId()
    {
        String prefix = "TXN";
        String datePart = new SimpleDateFormat("yyyyMMdd").format(new Date());

        // Generate random 6-digit number or use current timestamp to make it unique-ish
        int randomNum = new Random().nextInt(999999999); // 0 to 999999
        String serialPart = String.format("%09d", randomNum); // pad with zeros

        return prefix + datePart + serialPart;
    }


    public void UpdateTransactionService(String generateTransactionId, String userId, String userId1, String amount, String completed, String bankBalance)
    {
        userPaymentRepo.UpdatingTransactionHistory(generateTransactionId,userId,userId1,amount,completed,bankBalance);
    }
    public void UpdateTransactionofSendMoneyService(String generateTransactionId, String userId, String userId1, String amount, String completed, String bankBalance)
    {
        userPaymentRepo.UpdatingTransactionHistoryofSendMoney(generateTransactionId,userId,userId1,amount,completed,bankBalance);
    }

    public void UpdateFailedTransactionService(String generateTransactionId, String userId, String userId1, String amount, String completed, String bankBalance)
    {
        userPaymentRepo.UpdatingFailedTransactionHistory(generateTransactionId,userId1,userId,amount,completed,bankBalance);
    }


    public boolean processPgLoan(PGLoanRequest dto, String userId, String fileSavePath) throws Exception {
        String applicationId = UUID.randomUUID().toString();
       return loanRepo.savePgLoan(applicationId, userId, dto.getName(), dto.getAge(), dto.getDob(), dto.getTenthPercentage(), dto.getTwelfthPercentage(), dto.getUniversityName(), dto.getCourseName(), dto.getCourseDuration(), dto.getCounselingCode(), dto.getAadhaarCard(), dto.getPanCard(), dto.getFatherIncome(), fileSavePath, dto.getLoanAmount());
    }


    public boolean processUGLoan(UGLoanApplicationRequest request, MultipartFile[] documents) throws SQLException {

        String applicationId = UUID.randomUUID().toString();
        return   loanRepo.saveLoanApplication(request, applicationId, Arrays.toString(documents));
    }

    public boolean saveLoanApplicationAbroad(AbroadLoanRequest application)
    {
        String applicationId = UUID.randomUUID().toString();
        return loanRepo.saveLoanApplicationAbroad(application,applicationId);
    }

    public List<LoanStatusDTO> getLoanStatus(String userId) {
        List<LoanStatusDTO> allStatus = new ArrayList<>();
        allStatus.addAll(loanRepo.fetchUGLoanStatus(userId));
        allStatus.addAll(loanRepo.fetchPGLoanStatus(userId));
        allStatus.addAll(loanRepo.fetchAbroadLoanStatus(userId));
        return allStatus;
    }

    public String checkCredentialsOfAddMoneyService(AddPaymentRequest request)
    {
        boolean panVerification  = userPaymentRepo.verifyingPanAddress(request.getUserId(),request.getPan());
        boolean gmailVerification = userPaymentRepo.verifyingEmailAddress(request.getUserId(),request.getGmail());
        boolean PaymentPasswordVerification = userPaymentRepo.verifyingPaymentPassword(request.getUserId(),request.getPaymentPassword());
        UserService service = new UserService();
        String checkMoneyCredientials = service.checkMoney(request.getAmount());
        if(!request.getUserId().equals(request.getAadhar()))
        {
            return "Invalid Aadhar Number";
        }
        else if(!panVerification)
        {
            return "Invalid Pan ID";
        }
        else if(!gmailVerification)
        {
            return "Invalid Gmail Address";
        }
        else if(!PaymentPasswordVerification)
        {
            return "Invalid Payment Password";
        }
        else if(!checkMoneyCredientials.equals("checked"))
        {
            return "Invalid Money";
        }
        return "done";
    }
    public String checkMoney(String money)
    {
        if(money==null||money.isEmpty())
        {
            return "Amount is Not null";
        }
        else if(!money.matches("0|([1-9]\\d*)") || !money.matches("\\d+"))
        {
            return "Invalid Money Format";
        }
        else if(Long.parseLong(money)<=0)
        {
            return "Invalid Money Format";
        }
        return "checked";
    }
    public void updatingFailedPaymentNotificationService(String userID,String title,String msg)
    {
        userPaymentRepo.updatingFailedPaymentNotificationRepo(userID,title,msg);
    }

    public String validateSendMoneyCredentialsService(SendPaymentRequest request)
    {
        boolean isRecieverThere = userPaymentRepo.isRecieverThereRepo(request.getReceiverAadhar());
        String isRecieverActive = userPaymentRepo.isRecieverActiveRepo(request.getReceiverAadhar());
        boolean panVerification  = userPaymentRepo.verifyingPanAddress(request.getUserId(),request.getReceiverPan());
        boolean Login_password = repo.verifyPassword(request.getUserId(),request.getLoginPassword());
        boolean PaymentPasswordVerification = userPaymentRepo.verifyingPaymentPassword(request.getUserId(),request.getPaymentPassword());
        UserService service = new UserService();
        String checkMoneyCredientials = service.checkMoney(request.getAmount());
        if(!isRecieverThere)
        {
            return "Receiver ID Not found";
        }
        else if(request.getUserId().equals(request.getReceiverAadhar()))
        {
            return "You cannot send Money to Yourself";
        }
        else if (!isRecieverActive.equals("Active"))
        {
            isRecieverActive = "Receiver ID is Freeze";
            return isRecieverActive;
        }
        else if(!panVerification)
        {
            return "Invalid Pan ID";
        }
        else if(!PaymentPasswordVerification)
        {
            return "Invalid Payment Password";
        }
        else if(!Login_password)
        {
            return "Invalid Login Password";
        }
        else if(!checkMoneyCredientials.equals("checked"))
        {
            return "Invalid Money Format";
        }
        return "checked";
    }

    public boolean isAnyPendingLoanService(String userID)
    {
        boolean ug = loanRepo.isPendingUgLoanRepo(userID);
        boolean pg = loanRepo.isPendingPgLoanRepo(userID);
        boolean abroad = loanRepo.isPendingAbroadLoanRepo(userID);
        return ug && pg && abroad;
    }
    public boolean deletingTransactionService(String userID)
    {
        return loanRepo.deletingTransactionHistoryRepo(userID);
    }

    public boolean deletingNotificationService(String userID)
    {
        return loanRepo.deletingNotificationRepo(userID);
    }


    public boolean deletingAccountService(String userID)
    {
        return loanRepo.deletingAccountRepo(userID);
    }

    public LoanDetails findLoanByApplicationId(String applicationId) {
        return loanRepo.findLoanByApplicationId(applicationId);
    }

    public String gettingLoanSancnedMoneyService(String app_id)
    {
        return loanRepo.gettingSanchenedAmount(app_id);
    }

    public boolean deductingMoneyPayLoanService(String userid,String app_id,String money)
    {
        return userPaymentRepo.decutingMONEYrepo(userid,app_id,money);
    }

    public void setting_0_Service(String userID,String app_id,String status)
    {
        userPaymentRepo.Setting_0_toLoanifPossibleRepo(userID,app_id,status);
    }

    public List<String> gettingPendingLoanIdService()
    {
           return loanRepo.gettingPendingLoanRepo();
    }

}
