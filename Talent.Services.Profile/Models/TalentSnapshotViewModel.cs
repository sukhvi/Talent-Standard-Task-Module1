using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Models;

namespace Talent.Services.Profile.Models
{
    public class TalentSnapshotViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string PhotoId { get; set; }
        public string VideoUrl { get; set; }
        public string CVUrl { get; set; }
        public string Summary { get; set; }
        public TalentSnapshotCurrentEmploymentViewModel CurrentEmployment { get; set; }
        public string Visa { get; set; }
        public string Level { get; set; }
        public List<string> Skills { get; set; }
        public LinkedAccounts LinkedAccounts { get; set; }
    }

    public class TalentSnapshotCurrentEmploymentViewModel
    {
        public string Company { get; set; }
        public string Position { get; set; }
    }

}
