using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _bucketName;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment,
    IAwsService awsService)
        {
            _environment = environment;
            _bucketName = "leo-mvp-talent";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string fileName, FileType type)
        {
            return await _awsService.GetStaticUrl(fileName, _bucketName);
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            string fileName = null;
            if (file != null && type == FileType.ProfilePhoto)
            {
                fileName = $@"img{DateTime.Now.Ticks}";
                var result = await _awsService.PutFileToS3(fileName, file.OpenReadStream(), _bucketName, true);
                if (!result) fileName = null;
            }
            return fileName;
        }

        public async Task<bool> DeleteFile(string fileName, FileType type)
        {
            return await _awsService.RemoveFileFromS3(fileName, _bucketName);
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}