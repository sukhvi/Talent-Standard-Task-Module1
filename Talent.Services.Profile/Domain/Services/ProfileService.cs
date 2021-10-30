using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
            _fileService = fileService;
        }

        public  bool AddNewLanguage(AddLanguageViewModel language) {
            try {
                _userLanguageRepository.Add(LanguageFromViewModel(language));
                return true;
            } catch (Exception ex) {
                return false;
                throw ex;
            }
        }

        public async Task<bool> DeleteLanguage(AddLanguageViewModel language) {
            try {
                UserLanguage selectedLanguage = LanguageFromViewModel(language);
                selectedLanguage.IsDeleted = true;
                await _userLanguageRepository.Update(selectedLanguage);
                return true;
            } catch (Exception ex) {
                return false;
            }
        }

        public async Task<bool> UpdateLanguage(AddLanguageViewModel language) {
            try {
                await _userLanguageRepository.Update(LanguageFromViewModel(language));
                return true;
            } catch (Exception ex) {
                return false;
            }
        }
        
        public bool AddSkill(AddSkillViewModel skill) {
            try {
                _userSkillRepository.Add(SkillFromViewModel(skill));
                return true;
            } catch (Exception ex) {
                return false;
            }
        }

        public async Task<bool> UpdateSkill(AddSkillViewModel skill) {
            try {
                await _userSkillRepository.Update(SkillFromViewModel(skill));
                return true;
            } catch(Exception ex) {
                return false;
            }
        }

        public async Task<bool> DeleteSkill(AddSkillViewModel skill) {
            try {
                UserSkill selectedSkill = SkillFromViewModel(skill);
                selectedSkill.IsDeleted = true;
                await _userSkillRepository.Update(selectedSkill);
                return true;
            } catch (Exception ex) {
                return false;
            }
        }


        public bool AddExperience(ExperienceViewModel experience) {
            try {
                _userExperienceRepository.Add(ExperienceFromViewModel(experience));
                return true;
            } catch (Exception ex) {
                return false;
            }
        }

        public async Task<bool> UpdateExperience(ExperienceViewModel experience) {
            try {
                await _userExperienceRepository.Update(ExperienceFromViewModel(experience));
                return true;
            } catch (Exception ex) {
                return false;
            }
        }

        public async Task<bool> DeleteExperience(ExperienceViewModel experience) {
            try {
                UserExperience selectedExperience = ExperienceFromViewModel(experience);
                selectedExperience.IsDeleted = true;
                await _userExperienceRepository.Update(selectedExperience);
                return true;
            } catch (Exception ex) {
                return false;
            }
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id) {
            //Your code here;
            User profile = null;
            profile = await _userRepository.GetByIdAsync(Id);
            var currentUser = _userAppContext.CurrentUserId;
            var languages = await _userLanguageRepository.Get(language => language.UserId == currentUser);
            var languageList = new List<AddLanguageViewModel>();
            languageList = languages.Where(l => l.IsDeleted == false).Select(x => ViewModelFromLanguage(x)).ToList();
            var skills = await _userSkillRepository.Get(s => s.UserId == currentUser);
            var skillList = new List<AddSkillViewModel>();
            skillList = skills.Where(s => s.IsDeleted == false).Select(x => ViewModelFromSkill(x)).ToList();
            var experiences = await _userExperienceRepository.Get(e => e.UserId == currentUser);
            var experienceList = new List<ExperienceViewModel>();
            experienceList = experiences.Where(e => e.IsDeleted == false).Select(x => ViewModelFromExperience(x)).ToList();

            var result = new TalentProfileViewModel {
                Id = profile.Id,
                FirstName = profile.FirstName,
                MiddleName = profile.MiddleName,
                LastName = profile.LastName,
                Gender = profile.Gender,
                Email = profile.Email,
                Phone = profile.Phone,
                MobilePhone = profile.MobilePhone,
                IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                Address = profile.Address,
                Nationality = profile.Nationality,
                VisaStatus = profile.VisaStatus,
                VisaExpiryDate = profile.VisaExpiryDate,
                ProfilePhoto = profile.ProfilePhoto,
                ProfilePhotoUrl = profile.ProfilePhotoUrl,
                VideoName = profile.VideoName,
                VideoUrl = profile.VideoUrl,
                CvName = profile.CvName,
                CvUrl = profile.CvUrl,
                Summary = profile.Summary,
                Description = profile.Description,
                LinkedAccounts = profile.LinkedAccounts,
                JobSeekingStatus = profile.JobSeekingStatus,
                Languages = languageList,
                Skills = skillList,
                Experience = experienceList
            };
            return result;

            //public List<AddEducationViewModel> Education { get; set; }
        //public List<AddCertificationViewModel> Certifications { get; set; }
        //public List<ExperienceViewModel> Experience { get; set; }

    }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel profile, string updaterId)
        {
            try
            {
                if(profile.Id != null)
                {
                    User existingUser = (await _userRepository.GetByIdAsync(profile.Id));
                    existingUser.Id = profile.Id;
                    existingUser.FirstName = profile.FirstName;
                    existingUser.MiddleName = profile.MiddleName;
                    existingUser.LastName = profile.LastName;
                    existingUser.Gender = profile.Gender;
                    existingUser.Email = profile.Email;
                    existingUser.Phone = profile.Phone;
                    existingUser.MobilePhone = profile.MobilePhone;
                    existingUser.IsMobilePhoneVerified = profile.IsMobilePhoneVerified;
                    existingUser.Address = profile.Address;
                    existingUser.Nationality = profile.Nationality;
                    existingUser.VisaStatus = profile.VisaStatus;
                    existingUser.VisaExpiryDate = profile.VisaExpiryDate;
                    existingUser.ProfilePhoto = profile.ProfilePhoto;
                    existingUser.ProfilePhotoUrl = profile.ProfilePhotoUrl;
                    existingUser.VideoName = profile.VideoName;
                    existingUser.VideoUrl = profile.VideoUrl;
                    existingUser.CvName = profile.CvName;
                    existingUser.CvUrl = profile.CvUrl;
                    existingUser.Summary = profile.Summary;
                    existingUser.Description = profile.Description;
                    existingUser.LinkedAccounts = profile.LinkedAccounts;
                    existingUser.JobSeekingStatus = profile.JobSeekingStatus;
                    await _userRepository.Update(existingUser);
                    return true;
                    
                } return false;
                
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<string> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return "Unsupport file type: " + fileExtension;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return "Can't find talent: " + talentId;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return null;
            }

            return "Save phote error";
        }

        public async Task<bool> DeleteTalentPhoto(string talentPhotoId)
        {
           
            var profile = (await _userRepository.Get(x => x.Id == _userAppContext.CurrentUserId)).SingleOrDefault();

                await _fileService.DeleteFile(talentPhotoId, FileType.ProfilePhoto);
                profile.ProfilePhoto = "";
                profile.ProfilePhotoUrl = "";
                await _userRepository.Update(profile);
                return true;
        }

        

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {

            if (position >= _userRepository.Collection.Count()) return null;
            var talentList = _userRepository.Collection.Skip(position).Take(increment).AsEnumerable();
            var result = new List<TalentSnapshotViewModel>();
            var videoUrl = "";
            var cvUrl = "";
            UserExperience experience;
            TalentSnapshotCurrentEmploymentViewModel employmentViewModel = null;

            foreach (var item in talentList)
            {
                videoUrl = string.IsNullOrWhiteSpace(item.VideoName)
                    ? ""
                    : await _fileService.GetFileURL(item.VideoName, FileType.UserVideo);
                cvUrl = string.IsNullOrWhiteSpace(item.CvName)
                    ? ""
                    : await _fileService.GetFileURL(item.CvName, FileType.UserCV);
                experience = null;
                // Find the lastest job
                foreach (var exp in item.Experience)
                {
                    if (experience == null)
                    {
                        experience = exp;
                    }
                    else
                    {
                        if (experience.End < exp.End)
                        {
                            experience = exp;
                        }
                    }
                }
                if (experience != null)
                {
                    employmentViewModel = new TalentSnapshotCurrentEmploymentViewModel
                    {
                        Company = experience.Company,
                        Position = experience.Position
                    };
                }

                var newItem = new TalentSnapshotViewModel
                {
                    Id = item.Id,
                    Name = item.FirstName + " " + item.LastName,
                    PhotoId = item.ProfilePhotoUrl,
                    VideoUrl = videoUrl,
                    CVUrl = cvUrl,
                    Summary = item.Summary,
                    CurrentEmployment = employmentViewModel,
                    Visa = item.VisaStatus,
                    Level = "",
                    Skills = item.Skills.Select(x => x.Skill).ToList(),
                    LinkedAccounts = item.LinkedAccounts
                };
                result.Add(newItem);
            }
            return result;

        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion


        

        
        protected UserLanguage LanguageFromViewModel(AddLanguageViewModel model) {
            return new UserLanguage {
                Id = model.Id,
                UserId = model.CurrentUserId,
                Language = model.Name,
                LanguageLevel = model.Level,
                IsDeleted = false,
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language) {
            return new AddLanguageViewModel {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language,
                CurrentUserId = language.UserId,
            };
        }

        protected UserExperience ExperienceFromViewModel(ExperienceViewModel experience) {
            return new UserExperience {
                Id = experience.Id,
                UserId = experience.CurrentUserId,
                Start = experience.Start,
                End = experience.End,
                Responsibilities = experience.Responsibilities,
                Company = experience.Company,
                Position = experience.Position,
                IsDeleted = false
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience) {
            return new ExperienceViewModel {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End,
                CurrentUserId = experience.UserId
            };
        }


        #region Build Views from Model

        protected UserSkill SkillFromViewModel(AddSkillViewModel model)
        {
            return new UserSkill
            {
                Id = model.Id,
                UserId = model.CurrentUserId,
                ExperienceLevel = model.Level,
                Skill = model.Name,
                IsDeleted = false,
            };
        }

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill,
                CurrentUserId = skill.UserId
            };
        }

        #endregion


        protected TalentSnapshotViewModel TalentSnapshotFromViewModel(User model)
        {
            List<string> sk = new List<string>();
            model.Skills.ForEach(skill => {
                sk.Add(skill.Skill);
            });

            return new TalentSnapshotViewModel
            {
                Id = model.Id,
                Name = model.FirstName + " " + model.MiddleName + " " + model.LastName,
                //CurrentEmployment = model.Experience.OrderByDescending(o => o.Start).FirstOrDefault(),
                Summary = model.Summary,
                CVUrl = model.CvName,
                VideoUrl = model.VideoName,
                PhotoId = model.ProfilePhotoUrl,
                Skills = sk.Count > 0 ? sk : (new List<string>() { "" }),
                Visa = model.VisaStatus,
                LinkedAccounts = model.LinkedAccounts
            };
        }





    }
}
