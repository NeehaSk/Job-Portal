import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import JobSeeker from "../models/jobSeeker.js";
import Recruiter from "../models/recruiter.js";
import Notification from "../models/notification.js";
import mailTransporter from "../utils/mailTransporter.js"; //mongoose
export const createJob = async (req, res) => {
  try {

    const {
      title,
      companyName,
      location,
      category,
      workMode,
      jobType,
      salary,
      skillsRequired,
      experienceLevel,
      description,
      expireAt,
      requirements
    } = req.body;

    /* ================= VALIDATION ================= */

    if (
      !title ||
      !companyName ||
      !category ||
      !location ||
      !workMode ||
      !jobType ||
      !experienceLevel ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (!salary || !salary.min || !salary.max) {
      return res.status(400).json({
        message: "Salary range is required"
      });
    }

    /* ================= NORMALIZE SKILLS ================= */

    const normalizedSkills = Array.isArray(skillsRequired)
      ? skillsRequired.map((s) => s.trim().toLowerCase())
      : (typeof skillsRequired === "string" 
          ? skillsRequired.split(",").map(s => s.trim().toLowerCase()).filter(Boolean)
          : []);

    /* ================= CREATE JOB ================= */

    const job = await Job.create({
      recruiter: req.user.id,
      title,
      companyName,
      location,
      category,
      workMode,
      jobType,
      salary,
      skillsRequired: normalizedSkills,
      experienceLevel,
      description,
      requirements,
      applicationDeadline: expireAt,
      status: "Open",
    });

    /* ================= SKILL MATCHING ================= */

    if (normalizedSkills.length > 0) {
      console.log(`[Job Alert] New job "${title}" posted. Matching skills: ${normalizedSkills.join(", ")}`);

      const matchedSeekers = await JobSeeker.find({
        isActive: true,
        "profile.skills": { 
          $in: normalizedSkills.map(skill => new RegExp(`^${skill}$`, "i")) 
        }
      });

      console.log(`[Job Alert] Found ${matchedSeekers.length} matching seekers for "${title}".`);

      for (const seeker of matchedSeekers) {
        try {
          await mailTransporter.sendMail({
            from: `"JobPortal Notifications" <${process.env.EMAIL_USER}>`,
            to: seeker.email,
            subject: `Skills Match Found: ${title} at ${companyName}`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
                <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">New Skill Match Alert! 🎯</h1>
                </div>
                <div style="padding: 30px; line-height: 1.6;">
                  <p style="font-size: 16px;">Hi <strong>${seeker.fullName}</strong>,</p>
                  <p style="font-size: 16px;">We found a new job posting that perfectly matches your skills and profile settings. Don't miss out on this opportunity!</p>
                  
                  <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                    <h3 style="margin-top: 0; color: #0f172a; font-size: 18px;">${title}</h3>
                    <p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>
                    <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
                    <p style="margin: 5px 0;"><strong>Experience:</strong> ${experienceLevel}</p>
                  </div>

                  <p style="text-align: center; margin-top: 30px;">
                    <a href="http://localhost:5173/job/${job._id}" 
                       style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                       View Details & Apply
                    </a>
                  </p>
                </div>
                <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
                  <p>© 2026 JobPortal Inc. All rights reserved.</p>
                  <p>You received this because your skills match this new job posting.</p>
                </div>
              </div>
            `,
          });
        } catch (err) {
          console.error("Mail error for seeker:", seeker.email, err.message);
        }
      } // End for loop

      // Create in-app notifications in bulk
      try {
        const notifications = matchedSeekers.map(seeker => ({
          recipient: seeker._id,
          recipientModel: "JobSeeker",
          title: "New Job Matching Your Skills!",
          message: `${companyName} is hiring for ${title} in ${location}.`,
          type: "NewJob",
          link: `/job/${job._id}`
        }));
        if (notifications.length > 0) {
          await Notification.insertMany(notifications);
        }
      } catch (notifyError) {
        console.error("Failed to send in-app notifications:", notifyError);
      }
    }

    return res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {

    console.error("Create Job Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message
      });
    }

    return res.status(500).json({
      message: "Server error"
    });

  }
};
/* =========================================================
   GET ALL JOBS (FILTER + PAGINATION)
========================================================= */
export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experience,
      minSalary,
      maxSalary,
      sort = "latest",
      page = 1,
      limit = 50,
    } = req.query;

    let filter = { status: "Open" };

    // Keyword search
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (experience) {
      filter.experienceLevel = experience;
    }

    // Salary filter (nested)
    if (minSalary) {
      filter["salary.min"] = { $gte: Number(minSalary) };
    }

    if (maxSalary) {
      filter["salary.max"] = { $lte: Number(maxSalary) };
    }

    /* Sorting */
    let sortOption = {};

    if (sort === "salary_asc") {
      sortOption["salary.min"] = 1;
    } else if (sort === "salary_desc") {
      sortOption["salary.max"] = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalJobs = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: Number(page),
      jobs,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const applyToJob = async (req, res) => {
  try {

    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers can apply",
      });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.status !== "Open") {
      return res.status(400).json({ message: "Job is closed" });
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already applied for this job",
      });
    }

    /* ================= GET APPLICANT DETAILS ================= */

    // Body fields are optional — if not provided (quick-apply), fetch from DB
    let { fullName, email, skills, experience } = req.body || {};

    if (!fullName || !email) {
      const seeker = await JobSeeker.findById(req.user.id).select("fullName email profile.skills");
      if (seeker) {
        fullName = fullName || seeker.fullName;
        email = email || seeker.email;
        if (!skills && seeker.profile?.skills?.length) {
          skills = seeker.profile.skills;
        }
      }
    }

    if (!fullName || !email) {
      return res.status(400).json({
        message: "Could not determine applicant details. Please complete your profile.",
      });
    }

    /* ================= CREATE APPLICATION ================= */

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      applicantDetails: {
        fullName,
        email,
        skills: Array.isArray(skills)
          ? skills
          : skills
            ? skills.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
        experience: experience || "",
      },
    });

    job.applicantsCount += 1;
    await job.save();

    /* ================= NOTIFY RECRUITER ================= */

    try {
      const recruiter = await Recruiter.findById(job.recruiter);
      if (recruiter) {
        // 1. In-app notification
        await Notification.create({
          recipient: recruiter._id,
          recipientModel: "Recruiter",
          title: "New Application Received!",
          message: `${fullName} has applied for your job posting: "${job.title}".`,
          type: "NewApplication",
          link: `/recruiter/job/${jobId}/applicants`
        });

        // 2. Email notification
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
            <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Job Application! 📬</h1>
            </div>
            <div style="padding: 30px; line-height: 1.6;">
              <p style="font-size: 16px;">Hi <strong>${recruiter.fullName}</strong>,</p>
              <p style="font-size: 16px;">You have received a new application for the position of <strong>${job.title}</strong>.</p>
              
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #4f46e5;">
                <p style="margin: 0; font-size: 16px;"><strong>Applicant:</strong> ${fullName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Experience:</strong> ${experience || "Not provided"}</p>
              </div>

              <p style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:5173/recruiter/job/${jobId}/applicants" 
                   style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                   Review Candidate
                </a>
              </p>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
              <p>© 2026 JobPortal Inc. All rights reserved.</p>
            </div>
          </div>
        `;

        await mailTransporter.sendMail({
          from: `"JobPortal Notifications" <${process.env.EMAIL_USER}>`,
          to: recruiter.email,
          subject: `New Applicant for ${job.title}: ${fullName}`,
          html: emailHtml,
        });

        console.log(`[Notification] Recruiter \${recruiter.email} notified about application from \${email}`);
      }
    } catch (notifyErr) {
      console.error("Failed to notify recruiter:", notifyErr.message);
    }

    res.status(201).json({
      message: "Applied successfully",
      application,
    });

  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET SINGLE JOB
========================================================= */
export const getSingleJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate("recruiter", "fullName email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let hasApplied = false;
    
    // Check if user is logged in and is a jobseeker
    if (req.user && req.user.role === "jobseeker") {
      const existingApplication = await Application.findOne({
        job: jobId,
        applicant: req.user.id
      });
      hasApplied = !!existingApplication;
    }

    // Spread job into plain object and add hasApplied
    res.status(200).json({
      ...job.toObject(),
      hasApplied
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET RECRUITER JOBS
========================================================= */
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET JOB APPLICANTS
========================================================= */
export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "fullName email mobile profile.skills profile.experience profile.designation profile.profilePhotoId profile.resumeId profile.education profile.industry profile.socialLinks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalApplicants: applications.length,
      applicants: applications,
      job
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET MY APPLICATIONS
========================================================= */
export const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({
        message: "Only job seekers allowed",
      });
    }

    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("job", "title companyName location jobType salary status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalApplied: applications.length,
      applications,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   UPDATE JOB (Recruiter only)
========================================================= */
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updates = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (updates.skillsRequired && Array.isArray(updates.skillsRequired)) {
      updates.skillsRequired = updates.skillsRequired.map(s => s.trim().toLowerCase());
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob
    });

  } catch (error) {
    console.error("Update Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   DELETE JOB (Recruiter only)
========================================================= */
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Job.findByIdAndDelete(jobId);
    await Application.deleteMany({ job: jobId });

    res.status(200).json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   UPDATE APPLICATION STATUS (Recruiter only)
========================================================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Shortlisted", "Interview", "Selected", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('applicant', 'fullName email');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only recruiter who created job can update status
    if (application.job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Define next steps based on status
    let nextStep = "Wait for recruiter review";
    if (status === "Shortlisted") nextStep = "You have been shortlisted! Wait for interview details.";
    if (status === "Interview") nextStep = "Prepare for technical round/interview";
    if (status === "Selected") nextStep = "Check your email for offer details";
    if (status === "Rejected") nextStep = "Keep applying! Better opportunities await.";

    application.status = status;
    application.nextStep = nextStep;

    const { message: customMessage, interviewDetails } = req.body;

    // Save interview details if provided
    if (status === "Interview" && interviewDetails) {
      application.interviewDetails = {
        date: interviewDetails.date,
        time: interviewDetails.time,
        link: interviewDetails.link,
        instructions: interviewDetails.instructions || ""
      };
    }

    // Add custom feedback/message if provided
    if (customMessage) {
      application.messages.push({
        sender: req.user.id,
        senderModel: "Recruiter",
        content: customMessage
      });
    }

    await application.save();

    // --- TRIGGER EMAIL NOTIFICATION ---
    try {
      let statusColor = "#4f46e5";
      if (status === "Selected") statusColor = "#10b981";
      if (status === "Rejected") statusColor = "#ef4444";
      if (status === "Interview") statusColor = "#f59e0b";

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
          <div style="background-color: ${statusColor}; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Application Update: ${status}</h1>
          </div>
          <div style="padding: 30px; line-height: 1.6;">
            <p style="font-size: 16px;">Hi <strong>${application.applicant.fullName}</strong>,</p>
            <p style="font-size: 16px;">We have an update regarding your application for the <strong>${application.job.title}</strong> role at <strong>${application.job.companyName}</strong>.</p>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid ${statusColor};">
              <p style="margin: 0; font-size: 16px;"><strong>Status:</strong> ${status}</p>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b;">${nextStep}</p>
            </div>

            ${status === "Interview" && application.interviewDetails?.date ? `
              <div style="margin-top: 25px; border-top: 1px solid #e2e8f0; pt: 20px;">
                <h3 style="color: #0f172a;">Interview Details</h3>
                <p><strong>Date:</strong> ${new Date(application.interviewDetails.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${application.interviewDetails.time}</p>
                <p><strong>Link:</strong> <a href="${application.interviewDetails.link}">${application.interviewDetails.link}</a></p>
                ${application.interviewDetails.instructions ? `<p><strong>Instructions:</strong> ${application.interviewDetails.instructions}</p>` : ""}
              </div>
            ` : ""}

            ${customMessage ? `
              <div style="margin-top: 25px; padding: 15px; background-color: #f1f5f9; border-radius: 8px; font-style: italic;">
                " ${customMessage} "
              </div>
            ` : ""}

            <p style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/my-applications" 
                 style="background-color: #4f46e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                 Track Application
              </a>
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p>© 2026 JobPortal Inc. All rights reserved.</p>
          </div>
        </div>
      `;

      await mailTransporter.sendMail({
        from: `"JobPortal Notifications" <${process.env.EMAIL_USER}>`,
        to: application.applicant.email,
        subject: `Update on your application for ${application.job.title}`,
        html: emailHtml,
      });
    } catch (emailErr) {
      console.error("Failed to send status update email:", emailErr.message);
    }

    // --- TRIGGER IN-APP NOTIFICATION ---
    try {
      await Notification.create({
        recipient: application.applicant._id,
        recipientModel: "JobSeeker",
        title: `Application Update: ${status}`,
        message: customMessage || `Your application for ${application.job.title} at ${application.job.companyName} has been updated to ${status}.`,
        type: "ApplicationStatus",
        link: `/my-applications/${applicationId}/tracker`
      });
    } catch (notifyError) {
      console.error("Failed to send status notification:", notifyError);
    }

    res.status(200).json({
      message: `Status updated to ${status}`,
      application
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   GET ALL RECRUITER APPLICATIONS
========================================================= */
export const getRecruiterAllApplications = async (req, res) => {
  try {
    // 1. Find all jobs posted by this recruiter
    const jobs = await Job.find({ recruiter: req.user.id }).select("_id");
    const jobIds = jobs.map(job => job._id);

    // 2. Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "fullName email mobile profile")
      .populate("job", "title companyName location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalApplicants: applications.length,
      applications
    });

  } catch (error) {
    console.error("Get All Recruiter Applications Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================================================
   ADD MESSAGE TO APPLICATION (Recruiter or JobSeeker)
========================================================= */
export const addApplicationMessage = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content required" });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check authorization (must be recruiter of the job or the applicant)
    const isRecruiter = application.job.recruiter.toString() === req.user.id;
    const isApplicant = application.applicant.toString() === req.user.id;

    if (!isRecruiter && !isApplicant) {
      return res.status(403).json({ message: "Not authorized to message on this application" });
    }

    const senderModel = isRecruiter ? "Recruiter" : "JobSeeker";
    const recipientId = isRecruiter ? application.applicant : application.job.recruiter;
    const recipientModel = isRecruiter ? "JobSeeker" : "Recruiter";

    application.messages.push({
      sender: req.user.id,
      senderModel,
      content
    });

    await application.save();

    // Notify recipient
    try {
      await Notification.create({
        recipient: recipientId,
        recipientModel,
        title: `New message for ${application.job.title}`,
        message: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
        type: "System",
        link: isRecruiter ? `/my-applications/${applicationId}/tracker` : `/recruiter/job/${application.job._id}/applicants`
      });
    } catch (notifyError) {
      console.error("Failed to send message notification:", notifyError);
    }

    res.status(200).json({
      message: "Message sent",
      application
    });

  } catch (error) {
    console.error("Add Message Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

